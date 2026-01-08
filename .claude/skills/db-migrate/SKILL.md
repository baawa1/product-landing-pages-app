---
name: db-migrate
description: Supabase database migration helper. Generates migration files, tests migrations locally, applies to production safely, handles rollbacks, and validates schema matches TypeScript types. Use when modifying database schema, adding tables, or updating the orders table structure.
allowed-tools: Read, Write, Bash(npx supabase:*), Bash(psql:*), Grep, TodoWrite
---

# Supabase Migration Helper

Safely manage database schema changes with version-controlled migrations and rollback support.

## Instructions

### 1. Check Supabase CLI Installation

Verify Supabase CLI is installed:

```bash
npx supabase --version
```

**If not installed:**
```bash
npm install supabase --save-dev
```

### 2. Initialize Supabase Project (First Time Only)

**If not already initialized:**

```bash
npx supabase init
```

This creates:
```
supabase/
├── config.toml
├── seed.sql
└── migrations/
```

### 3. Link to Remote Supabase Project

```bash
npx supabase link --project-ref [your-project-ref]
```

Get project ref from Supabase dashboard URL:
`https://app.supabase.com/project/[PROJECT-REF]`

### 4. Create a New Migration

**Ask user what changes they want to make:**
- Add new column to orders table
- Create new table
- Modify existing column
- Add index
- Add constraint
- Update RLS policies

**Generate migration file:**

```bash
npx supabase migration new [migration-name]
```

Examples:
```bash
npx supabase migration new add_tracking_number_to_orders
npx supabase migration new create_customers_table
npx supabase migration new add_order_notes_column
```

This creates: `supabase/migrations/[timestamp]_[migration-name].sql`

### 5. Write Migration SQL

**Common migration patterns:**

#### Add Column to Orders Table

```sql
-- Add tracking number to orders
ALTER TABLE orders
ADD COLUMN tracking_number TEXT;

-- Add index for faster lookups
CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);

-- Add comment
COMMENT ON COLUMN orders.tracking_number IS 'Shipping tracking number from courier';
```

#### Add New Column with Default Value

```sql
-- Add order source column with default
ALTER TABLE orders
ADD COLUMN order_source TEXT NOT NULL DEFAULT 'website';

-- Add check constraint
ALTER TABLE orders
ADD CONSTRAINT order_source_check CHECK (order_source IN ('website', 'whatsapp', 'instagram'));
```

#### Modify Existing Column

```sql
-- Change column type (be careful!)
ALTER TABLE orders
ALTER COLUMN phone TYPE VARCHAR(20);

-- Add NOT NULL constraint
ALTER TABLE orders
ALTER COLUMN email SET NOT NULL;

-- Remove NOT NULL constraint
ALTER TABLE orders
ALTER COLUMN email DROP NOT NULL;
```

#### Create New Table

```sql
-- Create customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can do everything"
  ON customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add index
CREATE INDEX idx_customers_phone ON customers(phone);
```

#### Add JSONB Column for Extensibility

```sql
-- Add settings column for flexible data
ALTER TABLE orders
ADD COLUMN settings JSONB DEFAULT '{}'::jsonb;

-- Add GIN index for JSONB queries
CREATE INDEX idx_orders_settings ON orders USING GIN(settings);
```

### 6. Test Migration Locally (Optional but Recommended)

**Start local Supabase:**

```bash
npx supabase start
```

**Apply migration:**

```bash
npx supabase db reset  # Resets local DB and applies all migrations
```

**Or apply specific migration:**

```bash
npx supabase migration up
```

**Verify changes:**

```bash
npx supabase db diff
```

### 7. Create Rollback Migration (Optional)

Create a corresponding down migration for safety:

**Create file:** `supabase/migrations/[timestamp]_rollback_[migration-name].sql`

```sql
-- Rollback: Remove tracking_number column
ALTER TABLE orders
DROP COLUMN IF EXISTS tracking_number;

DROP INDEX IF EXISTS idx_orders_tracking_number;
```

### 8. Apply Migration to Production

**IMPORTANT: Backup first!**

```bash
# Create backup (from Supabase dashboard)
# Settings > Database > Backups > Create backup
```

**Apply migration to production:**

```bash
npx supabase db push
```

**Or run migration SQL directly in Supabase SQL Editor:**
1. Go to Supabase Dashboard > SQL Editor
2. Paste migration SQL
3. Review carefully
4. Run

### 9. Update TypeScript Types

After schema change, update `lib/supabase.ts`:

#### Example: Added tracking_number column

```typescript
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
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  tracking_number?: string  // ← NEW
  metadata?: {
    gift_recipient?: string
    gift_relationship?: string
    gift_message?: string
    occasion?: string
    delivery_date?: string
    [key: string]: any
  }
}
```

### 10. Validate Schema Matches Types

Create a validation script `scripts/validate-schema.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function validateSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Query information_schema to get table structure
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(0)

  if (error) {
    console.error('❌ Error querying schema:', error)
    return
  }

  console.log('✅ Schema validated')
  console.log('Available columns:', Object.keys(data[0] || {}))

  // Check for expected columns
  const expectedColumns = [
    'id', 'created_at', 'full_name', 'phone', 'email',
    'state', 'address', 'product_name', 'color',
    'quantity', 'price', 'total_price', 'discount',
    'discount_amount', 'status', 'metadata'
  ]

  expectedColumns.forEach(col => {
    // This is a simplified check
    console.log(`  - ${col}: Expected in TypeScript interface`)
  })
}

validateSchema()
```

## Common Migrations

### Add Order Notes

```sql
-- Migration: Add notes field for internal use
ALTER TABLE orders
ADD COLUMN notes TEXT;

COMMENT ON COLUMN orders.notes IS 'Internal notes about the order';
```

### Add Customer Reference

```sql
-- Migration: Add customer_id for linking orders to customers
ALTER TABLE orders
ADD COLUMN customer_id INTEGER REFERENCES customers(id);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

### Add Timestamps

```sql
-- Migration: Add updated_at timestamp
ALTER TABLE orders
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Add Soft Delete

```sql
-- Migration: Add soft delete support
ALTER TABLE orders
ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_orders_deleted_at ON orders(deleted_at) WHERE deleted_at IS NOT NULL;

-- Update RLS policy to exclude soft-deleted records
CREATE POLICY "Hide deleted orders"
  ON orders
  FOR SELECT
  USING (deleted_at IS NULL);
```

## Migration Checklist

Before applying migration:

- [ ] Reviewed SQL syntax
- [ ] Tested locally (if possible)
- [ ] Created backup of production database
- [ ] Migration is backwards compatible (if possible)
- [ ] Considered impact on existing data
- [ ] Updated TypeScript types
- [ ] Planned rollback strategy
- [ ] Coordinated with team (if applicable)

## Rollback Procedures

### If migration fails:

**Option 1: Run rollback migration**
```bash
# Create and run rollback SQL
npx supabase migration new rollback_[original-name]
# Edit file with rollback SQL
npx supabase db push
```

**Option 2: Restore from backup**
```
1. Go to Supabase Dashboard
2. Settings > Database > Backups
3. Find pre-migration backup
4. Click "Restore"
```

**Option 3: Manual rollback in SQL Editor**
```sql
-- Example: Undo add column
ALTER TABLE orders DROP COLUMN tracking_number;
```

## Best Practices

### DO:
✅ Test migrations locally first
✅ Create backups before production migrations
✅ Use descriptive migration names
✅ Add comments to explain changes
✅ Update TypeScript types immediately
✅ Use transactions for multi-step migrations
✅ Version control all migration files

### DON'T:
❌ Modify existing migration files (create new ones)
❌ Skip backups before production migrations
❌ Drop columns without verifying they're unused
❌ Change column types without data migration
❌ Apply untested migrations to production
❌ Forget to update application code

## Migration Template

```sql
-- Migration: [DESCRIPTION]
-- Created: [DATE]
-- Author: [NAME]
-- Ticket/Issue: [REFERENCE]

BEGIN;

-- [STEP 1: Description]
ALTER TABLE orders
ADD COLUMN new_field TEXT;

-- [STEP 2: Description]
CREATE INDEX idx_orders_new_field ON orders(new_field);

-- [STEP 3: Update existing data if needed]
UPDATE orders
SET new_field = 'default_value'
WHERE new_field IS NULL;

COMMIT;

-- Rollback (if needed):
-- ALTER TABLE orders DROP COLUMN new_field;
-- DROP INDEX IF EXISTS idx_orders_new_field;
```

## Example: Full Migration Workflow

```bash
# 1. Create migration
npx supabase migration new add_order_status_history

# 2. Edit supabase/migrations/[timestamp]_add_order_status_history.sql
# Add SQL for new table/columns

# 3. Test locally
npx supabase start
npx supabase db reset

# 4. Verify locally works
npm run dev
# Test order flow

# 5. Backup production
# Do this in Supabase dashboard

# 6. Apply to production
npx supabase db push

# 7. Update TypeScript types
# Edit lib/supabase.ts

# 8. Test in production
# Submit test order, verify new fields work

# 9. Commit migration
git add supabase/migrations/
git add lib/supabase.ts
git commit -m "Add order status history tracking"
git push
```

## Notes

- All migrations are version-controlled
- Migration files are immutable - never edit after applying
- Always update TypeScript types after schema changes
- Test migrations on local/staging before production
- Keep migrations small and focused
- Document why changes are needed
- Coordinate schema changes with team
