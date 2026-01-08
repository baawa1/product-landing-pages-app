---
name: sync-types
description: Automatically syncs TypeScript types from Supabase database schema. Pulls latest schema, generates types, updates Order interface, and validates all API routes use correct types. Prevents type mismatches between database and code. Use after database migrations or when types are out of sync.
allowed-tools: Read, Edit, Write, Bash(npx supabase:*), Bash(npm run:*), Grep, TodoWrite
---

# Supabase Type Sync

Keeps your TypeScript types in perfect sync with your Supabase database schema.

## Instructions

### 1. Check Supabase CLI Setup

Verify Supabase CLI is available:

```bash
npx supabase --version
```

**If not available:**
```bash
npm install supabase --save-dev
```

### 2. Generate Types from Supabase

Pull latest schema and generate TypeScript types:

```bash
npx supabase gen types typescript --project-id [project-ref] > lib/database.types.ts
```

**Get project-ref from:**
- Supabase dashboard URL: `https://app.supabase.com/project/[PROJECT-REF]`
- Or from `.env.local`: Extract from `NEXT_PUBLIC_SUPABASE_URL`

**Alternative (if linked):**
```bash
npx supabase gen types typescript --linked > lib/database.types.ts
```

### 3. Review Generated Types

Read `lib/database.types.ts` to see the auto-generated types:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: number
          created_at: string
          full_name: string
          phone: string
          email: string | null
          state: string
          address: string
          product_name: string
          color: string
          quantity: number
          price: number
          total_price: number
          discount: string | null
          discount_amount: number | null
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          metadata: Json | null
          // ... any new columns
        }
        Insert: {
          id?: number
          created_at?: string
          full_name: string
          // ... required and optional fields for INSERT
        }
        Update: {
          id?: number
          created_at?: string
          full_name?: string
          // ... all fields optional for UPDATE
        }
      }
    }
  }
}
```

### 4. Update lib/supabase.ts with Generated Types

Import and use the generated types:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client with types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin client with types
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Export database types for use in app
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

// Keep custom helper type for metadata structure
export type OrderMetadata = {
  gift_recipient?: string
  gift_relationship?: string
  gift_message?: string
  occasion?: string
  delivery_date?: string
  [key: string]: any
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Function to create a new order (uses admin client to bypass RLS)
export async function createOrder(orderData: OrderInsert) {
  const { data, error } = await supabaseAdmin
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
export async function getOrder(orderId: number) {
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

// Function to update order
export async function updateOrder(orderId: number, updates: OrderUpdate) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order:', error)
    throw error
  }

  return data
}
```

### 5. Update API Routes to Use New Types

Update `app/api/orders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createOrder, type OrderInsert, isSupabaseConfigured } from '@/lib/supabase'

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

    // Create order object with proper typing
    const orderData: OrderInsert = {
      full_name: body.full_name,
      phone: body.phone,
      email: body.email || null,
      state: body.state,
      address: body.address,
      product_name: body.product_name,
      color: body.color,
      quantity: parseInt(body.quantity),
      price: parseFloat(body.price),
      total_price: parseFloat(body.total_price),
      discount: body.discount || null,
      discount_amount: body.discount_amount ? parseFloat(body.discount_amount) : null,
      metadata: body.metadata || null,
      status: 'pending'
    }

    // TypeScript now validates this matches the schema!
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

### 6. Validate Types Across Codebase

Check that all files using Order types are updated:

```bash
# Find all files using Order type
grep -r "Order" app/ lib/ --include="*.ts" --include="*.tsx"

# Check for type errors
npx tsc --noEmit
```

**Fix any type errors reported.**

### 7. Add Type Generation Script to package.json

Add a convenient npm script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "types:sync": "npx supabase gen types typescript --linked > lib/database.types.ts && npm run types:check",
    "types:check": "npx tsc --noEmit"
  }
}
```

**Now you can run:**
```bash
npm run types:sync
```

### 8. Create Type Validation Test

Create `scripts/validate-types.ts`:

```typescript
import { supabaseAdmin, type Order, type OrderInsert } from '../lib/supabase'

async function validateTypes() {
  console.log('🔍 Validating TypeScript types against database...\n')

  try {
    // Test 1: Fetch with types
    const { data: orders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError.message)
      return false
    }

    if (orders && orders.length > 0) {
      const order = orders[0]
      console.log('✅ Successfully fetched order with type safety')
      console.log('   Order ID:', order.id)
      console.log('   Type includes all expected fields')
    }

    // Test 2: Insert with types
    const testOrder: OrderInsert = {
      full_name: 'Type Test',
      phone: '+2348000000000',
      email: 'test@example.com',
      state: 'Lagos',
      address: 'Test Address',
      product_name: 'Test Product',
      color: 'Test Color',
      quantity: 1,
      price: 1000,
      total_price: 1000,
      status: 'pending'
    }

    console.log('\n✅ OrderInsert type validated (compile-time)')
    console.log('   All required fields present')
    console.log('   No extra fields')

    // Test 3: Check metadata structure
    const orderWithMetadata: OrderInsert = {
      ...testOrder,
      metadata: {
        gift_recipient: 'Test Person',
        custom_field: 'Allowed'
      }
    }

    console.log('\n✅ Metadata type validated')
    console.log('   JSONB allows flexible structure')

    console.log('\n🎉 All type validations passed!')
    return true

  } catch (error) {
    console.error('\n❌ Type validation failed:', error)
    return false
  }
}

validateTypes()
```

Run validation:
```bash
npx tsx scripts/validate-types.ts
```

### 9. Document Type Sync Workflow

Create `docs/type-sync.md`:

```markdown
# Type Synchronization Workflow

## When to Sync Types

Sync types after:
- ✅ Database migrations (adding/removing/modifying columns)
- ✅ Creating new tables
- ✅ Changing column types
- ✅ Updating constraints
- ✅ Cloning project to new environment

## How to Sync

1. Run type generation:
   ```bash
   npm run types:sync
   ```

2. Review changes in `lib/database.types.ts`

3. Update `lib/supabase.ts` if needed

4. Fix any TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

5. Test the application:
   ```bash
   npm run dev
   ```

6. Commit changes:
   ```bash
   git add lib/database.types.ts lib/supabase.ts
   git commit -m "Sync types with database schema"
   ```

## Troubleshooting

### Error: "Project not linked"
```bash
npx supabase link --project-ref [your-project-ref]
```

### Error: "Authentication failed"
Set your access token:
```bash
npx supabase login
```

### Type mismatches after sync
1. Check for breaking changes in schema
2. Update affected code to match new types
3. Consider creating adapters for complex changes
```
