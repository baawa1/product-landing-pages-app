import { z } from 'zod'
import validator from 'validator'

/**
 * Order Validation Schema
 *
 * Security features:
 * - Phone: Nigerian format validation
 * - Email: Standard email format
 * - Address: XSS prevention, length limits
 * - Names: Alphanumeric + common characters only
 * - Prices: Must be positive, finite numbers
 * - Metadata: Validates known fields, allows extensions
 *
 * All validation happens server-side (security)
 * and client-side (UX).
 */

// Nigerian phone number validator
const nigerianPhoneSchema = z.string()
  .refine(
    (phone) => {
      // Remove spaces and dashes
      const cleaned = phone.replace(/[\s-]/g, '')
      // Must be Nigerian number: +234... or 0...
      return validator.isMobilePhone(cleaned, 'en-NG')
    },
    { message: 'Invalid Nigerian phone number. Use format: +234... or 0...' }
  )

// Email validator (optional field)
const emailSchema = z.string()
  .email('Invalid email address')
  .optional()
  .or(z.literal(''))

// Price validator (must be positive)
const priceSchema = z.number()
  .positive('Price must be greater than 0')
  .finite('Price must be a valid number')

// Quantity validator
const quantitySchema = z.number()
  .int('Quantity must be a whole number')
  .positive('Quantity must be at least 1')
  .max(100, 'Maximum quantity is 100')

// State validator (Nigerian states)
const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
] as const

const stateSchema = z.enum(nigerianStates)

// Address validator
const addressSchema = z.string()
  .min(10, 'Address must be at least 10 characters')
  .max(500, 'Address must be less than 500 characters')
  .refine(
    (addr) => !/<script|javascript:|onerror=/i.test(addr),
    { message: 'Address contains invalid characters' }
  )

// Name validator
const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .refine(
    (name) => /^[a-zA-Z\s'-]+$/.test(name),
    { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  )

// Color validator - updated to match all available colors
const colorSchema = z.enum([
  'Navy Blue',
  'Classic Black',
  'Pure White',
  'Teal',
  'Blue White',
  'Black Gold',
  'Silver Black',
  'Gold Black',
  'Black'
])

// Product name validator
const productNameSchema = z.string()
  .min(1, 'Product name is required')
  .max(200, 'Product name is too long')
  .refine(
    (name) => /^[a-zA-Z0-9\s\-()]+$/.test(name),
    { message: 'Product name contains invalid characters' }
  )

// Metadata validator for gift bundles and additional data
const metadataSchema = z.object({
  gift_recipient: z.string().max(100).optional(),
  gift_relationship: z.string().max(50).optional(),
  gift_message: z.string().max(500).optional(),
  occasion: z.string().max(100).optional(),
  delivery_date: z.string().optional()
}).catchall(z.string().optional()) // Allow additional string fields

// Main order validation schema
export const orderSchema = z.object({
  full_name: nameSchema,
  phone: nigerianPhoneSchema,
  email: emailSchema,
  state: stateSchema,
  address: addressSchema,
  product_name: productNameSchema,
  color: colorSchema,
  quantity: quantitySchema,
  price: priceSchema,
  total_price: priceSchema,
  discount: z.string().max(50).optional(),
  discount_amount: z.number().nonnegative().optional(),
  metadata: metadataSchema.optional(),
  stockStatus: z.enum(['in-stock', 'out-of-stock']).optional()
})

export type OrderInput = z.infer<typeof orderSchema>

/**
 * Helper function to sanitize HTML (prevent XSS)
 * Use this when displaying user-submitted data
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Client-side validation helpers
 */
export const clientValidation = {
  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, '')
    return validator.isMobilePhone(cleaned, 'en-NG')
  },

  email: (email: string): boolean => {
    if (!email || email.trim() === '') return true // Optional field
    return validator.isEmail(email)
  },

  name: (name: string): boolean => {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name)
  },

  address: (address: string): boolean => {
    return address.length >= 10 && address.length <= 500 && !/<script|javascript:|onerror=/i.test(address)
  }
}
