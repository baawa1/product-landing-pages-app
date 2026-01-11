import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

/**
 * Determines which orders table to use based on request hostname
 * @param hostname - The request hostname from headers.get('host')
 * @returns 'test_orders' for localhost/vercel.app, 'orders' for production
 */
export function getOrdersTableName(hostname: string | null): 'orders' | 'test_orders' {
  if (!hostname) {
    console.warn('⚠️ Unable to determine hostname, defaulting to production orders table')
    return 'orders'
  }

  // Normalize hostname (remove port number if present)
  const normalizedHostname = hostname.split(':')[0].toLowerCase()

  const isLocalhost = normalizedHostname === 'localhost' ||
                      normalizedHostname === '127.0.0.1' ||
                      normalizedHostname === '0.0.0.0'
  const isVercelPreview = normalizedHostname.endsWith('.vercel.app')

  if (isLocalhost || isVercelPreview) {
    console.log(`📝 Using test_orders table for hostname: ${normalizedHostname}`)
    return 'test_orders'
  }

  console.log(`✅ Using production orders table for hostname: ${normalizedHostname}`)
  return 'orders'
}

// Order type definition
export interface Order {
  id?: number
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
  discount_amount?: number
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'out-of-stock'
  metadata?: {
    gift_recipient?: string
    gift_relationship?: string
    gift_message?: string
    occasion?: string
    delivery_date?: string
    [key: string]: string | undefined // Allow additional custom fields
  }
}

// Function to create a new order (uses admin client to bypass RLS)
export async function createOrder(orderData: Order, tableName: 'orders' | 'test_orders' = 'orders') {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .insert([{
      ...orderData,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    console.error(`Error creating order in ${tableName}:`, error)
    throw error
  }

  return data
}

// Function to get order by ID
export async function getOrder(orderId: number, tableName: 'orders' | 'test_orders' = 'orders') {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', orderId)
    .single()

  if (error) {
    console.error(`Error fetching order from ${tableName}:`, error)
    throw error
  }

  return data
}
