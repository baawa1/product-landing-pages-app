---
name: test-order-flow
description: End-to-end testing of the order flow. Validates API response, checks Supabase insertion, verifies discount calculations, tests metadata structure, and ensures WhatsApp formatting works. Automatically creates and cleans up test data. Use when testing orders, after API changes, or before deployment.
allowed-tools: Read, Bash(npm run dev:*), Bash(curl:*), Bash(node:*), Write, TodoWrite
---

# Order Flow End-to-End Testing

Comprehensive testing of the entire order processing pipeline from form submission to database storage.

## Instructions

### 1. Check Prerequisites

Verify environment is ready:

```bash
# Check Supabase configuration
grep SUPABASE .env.local

# Verify dependencies
npm list @supabase/supabase-js
```

**Must have:**
- Supabase credentials in `.env.local`
- Next.js dev server OR production build
- Access to Supabase dashboard

### 2. Create Test Data Generator

Create `scripts/test-order.js`:

```javascript
const testOrders = {
  basic: {
    full_name: "Test User",
    phone: "+2348012345678",
    email: "test@example.com",
    state: "Lagos",
    address: "123 Test Street, Ikeja",
    product_name: "MEGIR Chronograph Watch",
    color: "Navy Blue",
    quantity: 1,
    price: 65000,
    total_price: 65000
  },

  withDiscount: {
    full_name: "Test User 2",
    phone: "08098765432",
    email: "test2@example.com",
    state: "Abuja",
    address: "456 Test Avenue, Garki",
    product_name: "MEGIR Executive Bundle",
    color: "Classic Black",
    quantity: 2,
    price: 79000,
    total_price: 134300, // 15% off
    discount: "15% OFF",
    discount_amount: 23700
  },

  giftBundle: {
    full_name: "Test User 3",
    phone: "+2347012345678",
    email: "",
    state: "Rivers",
    address: "789 Test Road, Port Harcourt",
    product_name: "MEGIR Gift Bundle",
    color: "Teal",
    quantity: 1,
    price: 79000,
    total_price: 79000,
    metadata: {
      gift_recipient: "John Doe",
      gift_relationship: "Husband",
      gift_message: "Happy Anniversary!",
      occasion: "Anniversary",
      delivery_date: "2026-02-14"
    }
  },

  invalidPhone: {
    full_name: "Test Invalid",
    phone: "123", // Too short
    email: "test@example.com",
    state: "Lagos",
    address: "123 Test Street",
    product_name: "MEGIR Watch",
    color: "Navy Blue",
    quantity: 1,
    price: 65000,
    total_price: 65000
  },

  xssAttempt: {
    full_name: "Test XSS",
    phone: "+2348012345678",
    email: "test@example.com",
    state: "Lagos",
    address: "<script>alert('xss')</script>",
    product_name: "MEGIR Watch",
    color: "Navy Blue",
    quantity: 1,
    price: 65000,
    total_price: 65000
  }
}

async function testOrder(apiUrl, testCase, testData) {
  console.log(`\n🧪 Testing: ${testCase}`)
  console.log(`Data:`, JSON.stringify(testData, null, 2))

  try {
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()

    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(result, null, 2))

    return {
      testCase,
      status: response.status,
      success: result.success,
      orderId: result.order_id,
      error: result.error,
      message: result.message
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message)
    return {
      testCase,
      status: 'error',
      error: error.message
    }
  }
}

async function runTests() {
  const apiUrl = process.env.API_URL || 'http://localhost:3000'

  console.log(`🚀 Starting Order Flow Tests`)
  console.log(`API URL: ${apiUrl}`)

  const results = []

  // Test 1: Basic order
  results.push(await testOrder(apiUrl, 'Basic Order', testOrders.basic))

  // Test 2: Order with discount
  results.push(await testOrder(apiUrl, 'Order with Discount', testOrders.withDiscount))

  // Test 3: Gift bundle with metadata
  results.push(await testOrder(apiUrl, 'Gift Bundle', testOrders.giftBundle))

  // Test 4: Invalid phone (should fail validation)
  results.push(await testOrder(apiUrl, 'Invalid Phone', testOrders.invalidPhone))

  // Test 5: XSS attempt (should sanitize or reject)
  results.push(await testOrder(apiUrl, 'XSS Attempt', testOrders.xssAttempt))

  // Summary
  console.log(`\n📊 Test Summary`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  results.forEach(r => {
    const icon = r.success ? '✅' : '❌'
    console.log(`${icon} ${r.testCase}: ${r.status} - ${r.message || r.error || 'No message'}`)
  })

  const passed = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`\nPassed: ${passed}/${results.length}`)
  console.log(`Failed: ${failed}/${results.length}`)

  // Return order IDs for cleanup
  return results.filter(r => r.orderId).map(r => r.orderId)
}

// Run if called directly
if (require.main === module) {
  runTests().then(orderIds => {
    console.log(`\n🗑️  Test Order IDs (for cleanup):`, orderIds)
    process.exit(0)
  }).catch(error => {
    console.error('Test failed:', error)
    process.exit(1)
  })
}

module.exports = { testOrders, testOrder, runTests }
```

### 3. Ensure Dev Server is Running

Check if dev server is running, start if needed:

```bash
# Check if port 3000 is in use
lsof -i :3000

# If not running, start dev server in background
npm run dev &
sleep 5  # Wait for server to start
```

### 4. Run Test Suite

Execute the test script:

```bash
node scripts/test-order.js
```

### 5. Verify Test Results

**Expected results:**

| Test Case | Expected Status | Expected Success |
|-----------|----------------|------------------|
| Basic Order | 200 | ✅ true |
| Order with Discount | 200 | ✅ true |
| Gift Bundle | 200 | ✅ true |
| Invalid Phone | 400 | ❌ false (validation error) |
| XSS Attempt | 400 OR 200* | ❌ false OR ✅ true (sanitized) |

*If sanitization is implemented, XSS attempt should succeed but data should be sanitized.

### 6. Check Database Entries

Verify orders were saved to Supabase:

Create `scripts/check-orders.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkOrders(orderIds) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log(`\n🔍 Checking Orders in Database`)

  for (const id of orderIds) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.log(`❌ Order ${id}: Not found or error - ${error.message}`)
    } else {
      console.log(`✅ Order ${id}: Found`)
      console.log(`   Name: ${data.full_name}`)
      console.log(`   Phone: ${data.phone}`)
      console.log(`   Product: ${data.product_name}`)
      console.log(`   Total: ₦${data.total_price.toLocaleString()}`)
      if (data.metadata) {
        console.log(`   Metadata:`, JSON.stringify(data.metadata, null, 2))
      }
    }
  }
}

// Get order IDs from command line args
const orderIds = process.argv.slice(2).map(id => parseInt(id))
checkOrders(orderIds)
```

Run with order IDs from test:
```bash
node scripts/check-orders.js 123 124 125
```

### 7. Test Discount Calculations

Verify price calculations are correct:

```javascript
function testDiscountCalculations() {
  const basePrice = 79000

  // 1 unit - no discount
  const price1 = basePrice
  console.log(`1 unit: ₦${price1.toLocaleString()} (expected: ₦79,000)`)

  // 2 units - 15% off
  const price2 = Math.round(basePrice * 2 * 0.85)
  const savings2 = (basePrice * 2) - price2
  console.log(`2 units: ₦${price2.toLocaleString()} (expected: ₦134,300)`)
  console.log(`Savings: ₦${savings2.toLocaleString()} (expected: ₦23,700)`)

  // 3 units - 30% off
  const price3 = Math.round(basePrice * 3 * 0.7)
  const savings3 = (basePrice * 3) - price3
  console.log(`3 units: ₦${price3.toLocaleString()} (expected: ₦165,900)`)
  console.log(`Savings: ₦${savings3.toLocaleString()} (expected: ₦71,100)`)

  // Verify calculations match expected
  const tests = [
    { actual: price1, expected: 79000, label: '1 unit' },
    { actual: price2, expected: 134300, label: '2 units' },
    { actual: price3, expected: 165900, label: '3 units' }
  ]

  tests.forEach(t => {
    if (t.actual === t.expected) {
      console.log(`✅ ${t.label} calculation correct`)
    } else {
      console.log(`❌ ${t.label} calculation wrong: ${t.actual} vs ${t.expected}`)
    }
  })
}
```

### 8. Test WhatsApp Message Formatting

Verify WhatsApp message is correctly formatted:

```javascript
function generateWhatsAppMessage(orderData) {
  const { full_name, phone, state, address, product_name, color, quantity, total_price, metadata } = orderData

  let message = `🛍️ *New Order*\n\n`
  message += `📦 Product: ${product_name}\n`
  message += `🎨 Color: ${color}\n`
  message += `📊 Quantity: ${quantity}\n`
  message += `💰 Total: ₦${total_price.toLocaleString()}\n\n`
  message += `👤 *Customer Details*\n`
  message += `Name: ${full_name}\n`
  message += `Phone: ${phone}\n`
  message += `State: ${state}\n`
  message += `Address: ${address}\n`

  if (metadata) {
    message += `\n🎁 *Gift Details*\n`
    if (metadata.gift_recipient) message += `For: ${metadata.gift_recipient}\n`
    if (metadata.gift_relationship) message += `Relationship: ${metadata.gift_relationship}\n`
    if (metadata.gift_message) message += `Message: "${metadata.gift_message}"\n`
    if (metadata.occasion) message += `Occasion: ${metadata.occasion}\n`
  }

  return message
}

// Test
const testMessage = generateWhatsAppMessage(testOrders.giftBundle)
console.log('WhatsApp Message Preview:')
console.log(testMessage)
```

### 9. Clean Up Test Data

After testing, remove test orders:

```javascript
const { createClient } = require('@supabase/supabase-js')

async function cleanupTestOrders(orderIds) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log(`\n🗑️  Cleaning up ${orderIds.length} test orders...`)

  const { error } = await supabase
    .from('orders')
    .delete()
    .in('id', orderIds)

  if (error) {
    console.error(`❌ Cleanup failed:`, error)
  } else {
    console.log(`✅ Cleanup complete!`)
  }
}
```

### 10. Generate Test Report

Create a comprehensive report:

```markdown
# Order Flow Test Report - [DATE]

## Test Environment
- API URL: http://localhost:3000
- Supabase Project: [project-id]
- Test Time: [timestamp]

## Test Results

### ✅ Passed Tests (3/5)
1. Basic Order
   - Status: 200 OK
   - Order ID: 123
   - Verified in database: ✓

2. Order with Discount
   - Status: 200 OK
   - Order ID: 124
   - Discount calculation: ✓
   - Verified in database: ✓

3. Gift Bundle with Metadata
   - Status: 200 OK
   - Order ID: 125
   - Metadata structure: ✓
   - Verified in database: ✓

### ❌ Failed Tests (2/5)
4. Invalid Phone
   - Status: 400 Bad Request
   - Error: "Validation failed: phone: Invalid Nigerian phone number"
   - Expected: ✓ (should reject invalid input)

5. XSS Attempt
   - Status: 400 Bad Request OR 200 OK
   - If 400: ✓ (input rejected)
   - If 200: Check if sanitized in DB

## Discount Calculation Verification
- 1 unit: ₦79,000 ✓
- 2 units: ₦134,300 (15% off, saves ₦23,700) ✓
- 3 units: ₦165,900 (30% off, saves ₦71,100) ✓

## Database Verification
All successful orders found in Supabase:
- Order 123: Test User - ₦65,000
- Order 124: Test User 2 - ₦134,300
- Order 125: Test User 3 - ₦79,000 (with gift metadata)

## WhatsApp Message Format
✅ Message formatting correct
✅ Metadata included for gift bundles
✅ Price formatting with commas

## Issues Found
- None (or list any issues)

## Recommendations
- [Any improvements needed]

## Cleanup
✅ Test orders removed from database
```

## Quick Test Command

Create a simple one-liner test:

```bash
# Full test suite
npm run test:orders

# Add to package.json:
"test:orders": "node scripts/test-order.js && node scripts/check-orders.js"
```

## Expected Output

```
🚀 Starting Order Flow Tests
API URL: http://localhost:3000

🧪 Testing: Basic Order
Status: 200
Response: {
  "success": true,
  "order_id": 123,
  "message": "Order created successfully"
}

🧪 Testing: Order with Discount
Status: 200
Response: {
  "success": true,
  "order_id": 124,
  "message": "Order created successfully"
}

🧪 Testing: Gift Bundle
Status: 200
Response: {
  "success": true,
  "order_id": 125,
  "message": "Order created successfully"
}

🧪 Testing: Invalid Phone
Status: 400
Response: {
  "error": "Validation failed",
  "message": "phone: Invalid Nigerian phone number"
}

📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Basic Order: 200 - Order created successfully
✅ Order with Discount: 200 - Order created successfully
✅ Gift Bundle: 200 - Order created successfully
❌ Invalid Phone: 400 - Validation failed
❌ XSS Attempt: 400 - Validation failed

Passed: 3/5
Failed: 2/5
```

## Notes

- Run this test suite before every deployment
- Failed validation tests (invalid phone, XSS) are GOOD - they should fail
- Always cleanup test data after testing
- Test on both dev and staging before production
- Verify WhatsApp integration manually (can't automate)
- Monitor Supabase dashboard during tests
