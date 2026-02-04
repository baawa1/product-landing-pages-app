import { NextRequest, NextResponse } from 'next/server'
import { createOrder, Order, isSupabaseConfigured, getOrdersTableName } from '@/lib/supabase'
import { orderSchema } from '@/lib/validation'
import rateLimit, { DuplicateDetector } from '@/lib/rate-limit'

// Rate limiter: 10 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

// Duplicate detector: prevents same order within 5 minutes
const duplicateDetector = new DuplicateDetector(5 * 60 * 1000)

export async function POST(request: NextRequest) {
  let duplicateReserved = false
  let duplicatePhone = ''
  let duplicateProduct = ''

  try {
    // Get IP address for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') ?? '127.0.0.1'

    // Rate limiting: 10 requests per minute per IP
    try {
      await limiter.check(10, ip)
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          message: 'Request body must be valid JSON.'
        },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured - rejecting order create request')
      return NextResponse.json(
        {
          error: 'Service temporarily unavailable',
          message: 'Unable to submit your order right now. Please try again shortly.'
        },
        { status: 503 }
      )
    }

    const payload = body as Record<string, unknown>

    // Validate input with Zod schema
    const validationResult = orderSchema.safeParse({
      full_name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      state: payload.state,
      address: payload.address,
      product_name: payload.product_name,
      color: payload.color,
      quantity: Number(payload.quantity),
      price: Number(payload.price),
      total_price: Number(payload.total_price),
      discount: payload.discount,
      discount_amount:
        payload.discount_amount !== undefined &&
        payload.discount_amount !== null
          ? Number(payload.discount_amount)
          : undefined,
      metadata: payload.metadata,
      stockStatus: payload.stockStatus
    })

    if (!validationResult.success) {
      // Return first validation error
      const errors = validationResult.error.issues
      const firstError = errors[0]
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: `${firstError.path.join('.')}: ${firstError.message}`
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Check for duplicate orders
    if (!duplicateDetector.reserve(validatedData.phone, validatedData.product_name)) {
      return NextResponse.json(
        {
          error: 'Duplicate order detected',
          message: 'This order was already submitted recently. Please wait a few minutes before trying again.'
        },
        { status: 409 }
      )
    }
    duplicateReserved = true
    duplicatePhone = validatedData.phone
    duplicateProduct = validatedData.product_name

    // Create order object with validated data
    const orderData: Order = {
      full_name: validatedData.full_name,
      phone: validatedData.phone,
      email: validatedData.email || undefined,
      state: validatedData.state,
      address: validatedData.address,
      product_name: validatedData.product_name,
      color: validatedData.color,
      quantity: validatedData.quantity,
      price: validatedData.price,
      total_price: validatedData.total_price,
      discount: validatedData.discount,
      discount_amount: validatedData.discount_amount,
      metadata: validatedData.metadata as Order['metadata'],
      status: validatedData.stockStatus === 'out-of-stock' ? 'out-of-stock' : 'pending'
    }

    // Determine which table to use based on hostname
    const hostname = request.headers.get('host')
    const tableName = getOrdersTableName(hostname)

    // Save to Supabase
    const order = await createOrder(orderData, tableName)
    duplicateDetector.markAsProcessed(validatedData.phone, validatedData.product_name)
    duplicateReserved = false

    return NextResponse.json({
      success: true,
      order_id: order.id,
      message: 'Order created successfully'
    })

  } catch (error) {
    if (duplicateReserved) {
      duplicateDetector.release(duplicatePhone, duplicateProduct)
    }

    console.error('Error processing order:', error)
    return NextResponse.json(
      {
        error: 'Failed to process order',
        message: 'Unable to process your order right now. Please try again.'
      },
      { status: 500 }
    )
  }
}
