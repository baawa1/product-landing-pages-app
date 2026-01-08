---
name: check-orders
description: CLI dashboard for viewing order data. Shows recent orders, order status distribution, revenue summary (today/week/month), failed order attempts, and most popular products/colors. Quick insights without opening Supabase dashboard. Use when the user wants to check orders, view sales, or analyze order trends.
allowed-tools: Read, Write, Bash(node:*), Bash(npx tsx:*), TodoWrite
---

# Order Dashboard CLI

Quick command-line insights into your orders without opening Supabase dashboard.

## Instructions

### 1. Create Order Dashboard Script

Create `scripts/check-orders.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'

require('dotenv').config({ path: '.env.local' })

type Order = Database['public']['Tables']['orders']['Row']

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  statusDistribution: Record<string, number>
  topProducts: Array<{ product: string; count: number; revenue: number }>
  topColors: Array<{ color: string; count: number }>
  recentOrders: Order[]
}

async function getOrderStats(days: number = 7): Promise<OrderStats> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Fetch orders from the last N days
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      statusDistribution: {},
      topProducts: [],
      topColors: [],
      recentOrders: []
    }
  }

  // Calculate stats
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
  const averageOrderValue = totalRevenue / totalOrders

  // Status distribution
  const statusDistribution: Record<string, number> = {}
  orders.forEach(order => {
    const status = order.status || 'pending'
    statusDistribution[status] = (statusDistribution[status] || 0) + 1
  })

  // Top products
  const productStats = new Map<string, { count: number; revenue: number }>()
  orders.forEach(order => {
    const existing = productStats.get(order.product_name) || { count: 0, revenue: 0 }
    productStats.set(order.product_name, {
      count: existing.count + 1,
      revenue: existing.revenue + order.total_price
    })
  })
  const topProducts = Array.from(productStats.entries())
    .map(([product, stats]) => ({ product, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Top colors
  const colorStats = new Map<string, number>()
  orders.forEach(order => {
    colorStats.set(order.color, (colorStats.get(order.color) || 0) + 1)
  })
  const topColors = Array.from(colorStats.entries())
    .map(([color, count]) => ({ color, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    statusDistribution,
    topProducts,
    topColors,
    recentOrders: orders.slice(0, 10)
  }
}

async function displayDashboard(days: number = 7) {
  console.log('\n📊 BaaWA Order Dashboard')
  console.log(`Period: Last ${days} days`)
  console.log('━'.repeat(60))

  try {
    const stats = await getOrderStats(days)

    if (stats.totalOrders === 0) {
      console.log('\n📭 No orders in the selected period.')
      return
    }

    // Overall stats
    console.log('\n📈 Overview')
    console.log(`   Total Orders: ${stats.totalOrders}`)
    console.log(`   Total Revenue: ₦${stats.totalRevenue.toLocaleString()}`)
    console.log(`   Average Order: ₦${Math.round(stats.averageOrderValue).toLocaleString()}`)

    // Status distribution
    console.log('\n📦 Order Status')
    Object.entries(stats.statusDistribution)
      .sort(([, a], [, b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / stats.totalOrders) * 100).toFixed(1)
        const icon = {
          pending: '⏳',
          confirmed: '✅',
          shipped: '🚚',
          delivered: '📬'
        }[status] || '📋'
        console.log(`   ${icon} ${status.padEnd(12)}: ${count} (${percentage}%)`)
      })

    // Top products
    console.log('\n🏆 Top Products')
    stats.topProducts.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.product}`)
      console.log(`      Orders: ${item.count} | Revenue: ₦${item.revenue.toLocaleString()}`)
    })

    // Top colors
    console.log('\n🎨 Popular Colors')
    stats.topColors.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.color}: ${item.count} orders`)
    })

    // Recent orders
    console.log('\n🕐 Recent Orders (Last 10)')
    stats.recentOrders.forEach(order => {
      const date = new Date(order.created_at!).toLocaleString('en-NG')
      const status = {
        pending: '⏳',
        confirmed: '✅',
        shipped: '🚚',
        delivered: '📬'
      }[order.status || 'pending'] || '📋'

      console.log(`   ${status} #${order.id} - ${order.full_name}`)
      console.log(`      ${order.product_name} (${order.color})`)
      console.log(`      ₦${order.total_price.toLocaleString()} | ${date}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error fetching order data:', error)
  }
}

// Command line arguments
const args = process.argv.slice(2)
const command = args[0] || 'dashboard'
const days = parseInt(args[1]) || 7

switch (command) {
  case 'dashboard':
  case 'stats':
    displayDashboard(days)
    break

  case 'today':
    displayDashboard(1)
    break

  case 'week':
    displayDashboard(7)
    break

  case 'month':
    displayDashboard(30)
    break

  case 'recent':
    displayRecentOrders(parseInt(args[1]) || 10)
    break

  case 'search':
    searchOrders(args[1])
    break

  default:
    console.log('Usage:')
    console.log('  npm run orders                  # Dashboard for last 7 days')
    console.log('  npm run orders today            # Today\'s orders')
    console.log('  npm run orders week             # Last 7 days')
    console.log('  npm run orders month            # Last 30 days')
    console.log('  npm run orders stats [days]     # Stats for N days')
    console.log('  npm run orders recent [count]   # Recent N orders')
    console.log('  npm run orders search [name]    # Search by customer name')
}

async function displayRecentOrders(count: number) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(count)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`\n📋 ${count} Most Recent Orders\n`)

  orders?.forEach(order => {
    const date = new Date(order.created_at!).toLocaleDateString('en-NG')
    console.log(`#${order.id} - ${order.full_name} (${order.phone})`)
    console.log(`   ${order.product_name} - ${order.color}`)
    console.log(`   ₦${order.total_price.toLocaleString()} | ${order.status} | ${date}`)
    console.log('')
  })
}

async function searchOrders(searchTerm: string) {
  if (!searchTerm) {
    console.log('❌ Please provide a search term')
    return
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .ilike('full_name', `%${searchTerm}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  if (!orders || orders.length === 0) {
    console.log(`\n📭 No orders found for "${searchTerm}"`)
    return
  }

  console.log(`\n🔍 Search Results for "${searchTerm}" (${orders.length} found)\n`)

  orders.forEach(order => {
    const date = new Date(order.created_at!).toLocaleDateString('en-NG')
    console.log(`#${order.id} - ${order.full_name}`)
    console.log(`   Phone: ${order.phone}`)
    console.log(`   ${order.product_name} (${order.color})`)
    console.log(`   ₦${order.total_price.toLocaleString()} | ${order.status} | ${date}`)
    console.log('')
  })
}
```

### 2. Install Dependencies

```bash
npm install --save-dev tsx
```

### 3. Add Scripts to package.json

```json
{
  "scripts": {
    "orders": "npx tsx scripts/check-orders.ts",
    "orders:today": "npx tsx scripts/check-orders.ts today",
    "orders:week": "npx tsx scripts/check-orders.ts week",
    "orders:month": "npx tsx scripts/check-orders.ts month"
  }
}
```

### 4. Run the Dashboard

Execute the dashboard:

```bash
# Default: Last 7 days
npm run orders

# Today's orders only
npm run orders:today

# Last 30 days
npm run orders:month

# Custom days
npm run orders stats 14

# Recent orders
npm run orders recent 20

# Search by name
npm run orders search "John"
```

### 5. Create Advanced Analytics Script

Create `scripts/order-analytics.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface DailyStats {
  date: string
  orders: number
  revenue: number
}

async function getDailyTrend(days: number = 30) {
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total_price')
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

  const dailyMap = new Map<string, DailyStats>()

  orders?.forEach(order => {
    const date = new Date(order.created_at!).toISOString().split('T')[0]
    const existing = dailyMap.get(date) || { date, orders: 0, revenue: 0 }
    dailyMap.set(date, {
      date,
      orders: existing.orders + 1,
      revenue: existing.revenue + order.total_price
    })
  })

  const dailyStats = Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  console.log('\n📊 Daily Trend (Last 30 Days)\n')
  console.log('Date       | Orders | Revenue')
  console.log('─'.repeat(40))

  dailyStats.forEach(day => {
    console.log(
      `${day.date} | ${String(day.orders).padStart(6)} | ₦${day.revenue.toLocaleString()}`
    )
  })

  // Calculate growth
  if (dailyStats.length >= 2) {
    const lastWeek = dailyStats.slice(-7)
    const prevWeek = dailyStats.slice(-14, -7)

    const lastWeekRevenue = lastWeek.reduce((sum, day) => sum + day.revenue, 0)
    const prevWeekRevenue = prevWeek.reduce((sum, day) => sum + day.revenue, 0)

    if (prevWeekRevenue > 0) {
      const growth = ((lastWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100
      console.log(`\n📈 Week-over-week growth: ${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`)
    }
  }
}

getDailyTrend()
```

### 6. Create Export Script

Create `scripts/export-orders.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function exportOrders(format: 'json' | 'csv' = 'csv') {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `orders-export-${timestamp}.${format}`

  if (format === 'json') {
    fs.writeFileSync(filename, JSON.stringify(orders, null, 2))
  } else {
    // CSV format
    const headers = [
      'ID', 'Date', 'Customer', 'Phone', 'Email', 'Product',
      'Color', 'Quantity', 'Price', 'Total', 'Status', 'State', 'Address'
    ]

    const rows = orders?.map(order => [
      order.id,
      new Date(order.created_at!).toISOString(),
      order.full_name,
      order.phone,
      order.email || '',
      order.product_name,
      order.color,
      order.quantity,
      order.price,
      order.total_price,
      order.status || 'pending',
      order.state,
      order.address
    ])

    const csv = [
      headers.join(','),
      ...(rows?.map(row => row.map(cell => `"${cell}"`).join(',')) || [])
    ].join('\n')

    fs.writeFileSync(filename, csv)
  }

  console.log(`✅ Exported ${orders?.length} orders to ${filename}`)
}

const format = (process.argv[2] as 'json' | 'csv') || 'csv'
exportOrders(format)
```

**Usage:**
```bash
# Export as CSV
npx tsx scripts/export-orders.ts csv

# Export as JSON
npx tsx scripts/export-orders.ts json
```

## Example Output

```
📊 BaaWA Order Dashboard
Period: Last 7 days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Overview
   Total Orders: 47
   Total Revenue: ₦3,689,000
   Average Order: ₦78,489

📦 Order Status
   ⏳ pending        : 12 (25.5%)
   ✅ confirmed      : 28 (59.6%)
   🚚 shipped        : 5 (10.6%)
   📬 delivered      : 2 (4.3%)

🏆 Top Products
   1. MEGIR Gift Bundle
      Orders: 23 | Revenue: ₦1,817,000
   2. MEGIR Executive Bundle
      Orders: 15 | Revenue: ₦1,185,000
   3. MEGIR Chronograph Watch
      Orders: 9 | Revenue: ₦585,000

🎨 Popular Colors
   1. Navy Blue: 21 orders
   2. Classic Black: 15 orders
   3. Teal: 8 orders
   4. Pure White: 3 orders

🕐 Recent Orders (Last 10)
   ✅ #152 - John Doe
      MEGIR Gift Bundle (Navy Blue)
      ₦79,000 | 1/7/2026, 2:45:00 PM

   ⏳ #151 - Jane Smith
      MEGIR Executive Bundle (Classic Black)
      ₦134,300 | 1/7/2026, 1:30:00 PM

   ...
```

## Quick Commands Reference

```bash
# Dashboard commands
npm run orders              # Last 7 days dashboard
npm run orders:today        # Today only
npm run orders:week         # Last 7 days
npm run orders:month        # Last 30 days

# Custom queries
npm run orders stats 14     # Last 14 days
npm run orders recent 20    # 20 most recent orders
npm run orders search "John"  # Search by name

# Analytics
npx tsx scripts/order-analytics.ts

# Export
npx tsx scripts/export-orders.ts csv
npx tsx scripts/export-orders.ts json
```

## Notes

- Real-time data from Supabase
- No need to open dashboard for quick checks
- Export to CSV for accounting/analysis
- Track growth trends week-over-week
- Search orders by customer name
- Filter by date range
- Status distribution at a glance
