import { NextRequest, NextResponse } from 'next/server'
import { createOrder, Order, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - skipping database save')
      return NextResponse.json({
        success: true,
        message: 'Order received (database not configured)'
      })
    }

    // Validate required fields
    const requiredFields = ['full_name', 'phone', 'state', 'address', 'product_name', 'color', 'quantity', 'price']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create order object
    const orderData: Order = {
      full_name: body.full_name,
      phone: body.phone,
      email: body.email && body.email.trim() !== '' ? body.email : null,
      state: body.state,
      address: body.address,
      product_name: body.product_name,
      color: body.color,
      quantity: parseInt(body.quantity),
      price: parseFloat(body.price),
      total_price: parseFloat(body.total_price),
      discount: body.discount && body.discount.trim() !== '' ? body.discount : null,
      discount_amount: body.discount_amount ? parseFloat(body.discount_amount) : null,
      metadata: body.metadata || {},
      status: 'pending'
    }

    // Save to Supabase
    const order = await createOrder(orderData)

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
