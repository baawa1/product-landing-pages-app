import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Order type definition
export interface Order {
  id?: string
  created_at?: string
  full_name: string
  phone: string
  email?: string
  state: string
  address: string
  product_name: string
  color: string
  quantity: number
  price: number
  total_price: number
  discount?: string
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}

// Function to create a new order
export async function createOrder(orderData: Order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      ...orderData,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }

  return data
}

// Function to get order by ID
export async function getOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    throw error
  }

  return data
}
