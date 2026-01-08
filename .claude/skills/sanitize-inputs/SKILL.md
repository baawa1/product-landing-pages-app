---
name: sanitize-inputs
description: Automatically adds input sanitization and validation to protect against XSS and injection attacks. Implements validation for phone numbers (Nigerian format), emails, prices, quantities, and metadata. Adds Zod schemas for type-safe validation. Use when adding new forms, fixing security issues, or when the user mentions input validation or sanitization.
allowed-tools: Read, Edit, Write, Bash(npm install:*), Grep, Glob, TodoWrite
---

# Input Sanitization & Validation

Automatically hardens your application against XSS, injection attacks, and invalid data by adding comprehensive input validation.

## Instructions

### 1. Install Required Dependencies

First, install validation libraries:

```bash
npm install zod validator
npm install --save-dev @types/validator
```

**Why these libraries:**
- `zod` - Type-safe schema validation
- `validator` - Battle-tested string validators (email, phone, etc.)

### 2. Create Validation Schemas

Create `lib/validation.ts`:

```typescript
import { z } from 'zod'
import validator from 'validator'

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

const stateSchema = z.enum(nigerianStates as [string, ...string[]])

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

// Color validator
const colorSchema = z.enum(['Navy Blue', 'Classic Black', 'Pure White', 'Teal'])

// Product name validator
const productNameSchema = z.string()
  .min(1, 'Product name is required')
  .refine(
    (name) => /^[a-zA-Z0-9\s-]+$/.test(name),
    { message: 'Product name contains invalid characters' }
  )

// Metadata validator for gift bundles
const metadataSchema = z.object({
  gift_recipient: z.string().max(100).optional(),
  gift_relationship: z.string().max(50).optional(),
  gift_message: z.string().max(500).optional(),
  occasion: z.string().max(100).optional(),
  delivery_date: z.string().date().optional()
}).passthrough() // Allow additional fields but validate known ones

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
  metadata: metadataSchema.optional()
})

export type OrderInput = z.infer<typeof orderSchema>

// Helper function to sanitize HTML (prevent XSS)
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
```

### 3. Update API Route with Validation

Modify `app/api/orders/route.ts`:

**Find the section starting at line 18 (field validation) and replace with:**

```typescript
import { orderSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
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
      metadata: body.metadata
    })

    if (!validationResult.success) {
      // Return first validation error
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: `${firstError.path.join('.')}: ${firstError.message}`
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Create order object with validated data
    const orderData: Order = {
      ...validatedData,
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
```

### 4. Add Client-Side Validation to Forms

**For each product page form, add validation before submit:**

```typescript
// In handleSubmit function, before the fetch call:

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsSubmitting(true)

  const formData = new FormData(e.currentTarget)

  // Client-side validation for better UX
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  // Phone validation
  if (!phone || phone.trim().length < 10) {
    alert('Please enter a valid phone number')
    setIsSubmitting(false)
    return
  }

  // Email validation (if provided)
  if (email && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }
  }

  // Continue with existing fetch logic...
}
```

### 5. Add Rate Limiting (Critical Security)

Create `lib/rate-limit.ts`:

```typescript
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        return isRateLimited ? reject() : resolve()
      }),
  }
}

// Usage in API route:
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'

  try {
    await limiter.check(10, ip) // 10 requests per minute per IP
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  // Continue with order processing...
}
```

Install dependency:
```bash
npm install lru-cache
npm install --save-dev @types/lru-cache
```

### 6. Sanitize Display of User Data

**If displaying order data anywhere (admin panel, confirmation page):**

```typescript
import { sanitizeHtml } from '@/lib/validation'

// When rendering user-submitted data:
<p>{sanitizeHtml(order.address)}</p>
<p>{sanitizeHtml(order.full_name)}</p>
```

### 7. Add CORS Headers (If Not Already Present)

Check `next.config.ts` or create middleware at `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only allow API calls from your domain
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com', // Add your production domain
  ]

  const response = NextResponse.next()

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

### 8. Test All Validation

Create test cases:

```typescript
// Test invalid inputs:
- Phone: "123" (too short)
- Email: "notanemail" (invalid format)
- Price: -100 (negative)
- Quantity: 0 (must be at least 1)
- Address: "<script>alert('xss')</script>" (XSS attempt)
- Name: "John123" (numbers not allowed)
```

**Run manual tests:**
1. Submit form with invalid phone
2. Submit form with invalid email
3. Try to inject HTML in address field
4. Test rate limiting (submit 11 times in 1 minute)

### 9. Update TypeScript Types

Update `lib/supabase.ts` Order interface to match validation schema:

```typescript
import { z } from 'zod'
import { orderSchema } from './validation'

// Derive type from Zod schema (single source of truth)
export type Order = z.infer<typeof orderSchema> & {
  id?: number
  created_at?: string
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}
```

### 10. Document Validation Rules

Add comments to validation.ts explaining each rule:

```typescript
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
```

## Example Output

```
✅ Input Sanitization Complete!

Added:
- lib/validation.ts with Zod schemas
- Nigerian phone number validation
- Email format validation
- XSS prevention in address fields
- Price/quantity validation
- Rate limiting (10 req/min per IP)
- CORS headers
- Security headers

Updated:
- app/api/orders/route.ts
- app/product/megir/gift/page.tsx (client validation)

Installed:
- zod
- validator
- lru-cache

Next steps:
1. Test the validation with invalid inputs
2. Verify rate limiting works (try 11 submissions)
3. Check that error messages are user-friendly
4. Deploy and monitor for validation errors
```

## Common Validation Patterns

**Phone Number Formats (Nigerian):**
- `+2348012345678` ✓
- `08012345678` ✓
- `2348012345678` ✓
- `0801-234-5678` ✓ (dashes removed automatically)
- `123456` ❌ (too short)
- `+1234567890` ❌ (not Nigerian)

**Email Formats:**
- `user@example.com` ✓
- `user.name@example.co.ng` ✓
- `user+tag@example.com` ✓
- `notanemail` ❌
- `@example.com` ❌

**XSS Prevention:**
- Blocks: `<script>`, `javascript:`, `onerror=`, etc.
- Escapes: `<`, `>`, `"`, `'`, `/`

## Notes

- Validation happens on both client (UX) and server (security)
- Never trust client-side validation alone
- Rate limiting protects against brute force and spam
- Keep validation error messages user-friendly
- Log validation failures for monitoring
- Update validation rules as requirements change
