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

    const body = await request.json()

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - skipping database save')
      return NextResponse.json({
        success: true,
        message: 'Order received (database not configured)'
      })
    }

    // Validate input with Zod schema
    const validationResult = orderSchema.safeParse({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      state: body.state,
      address: body.address,
      product_name: body.product_name,
      color: body.color,
      quantity: Number(body.quantity),
      price: Number(body.price),
      total_price: Number(body.total_price),
      discount: body.discount,
      discount_amount: body.discount_amount ? Number(body.discount_amount) : undefined,
      metadata: body.metadata,
      stockStatus: body.stockStatus
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
    if (duplicateDetector.isDuplicate(validatedData.phone, validatedData.product_name)) {
      return NextResponse.json(
        {
          error: 'Duplicate order detected',
          message: 'This order was already submitted recently. Please wait a few minutes before trying again.'
        },
        { status: 409 }
      )
    }

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

    return NextResponse.json({
      success: true,
      order_id: order.id,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      {
        error: 'Failed to process order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
