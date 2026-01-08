---
name: analyze-conversions
description: Analyzes conversion metrics and user behavior. Checks GTM events, form submission rates, abandonment points, WhatsApp click-through rates, and page load performance. Identifies optimization opportunities. Use when optimizing conversion rates or when the user mentions analytics or tracking.
allowed-tools: Read, Write, Grep, Bash(npm run dev:*), Bash(curl:*), Bash(lighthouse:*), TodoWrite
---

# Conversion Analytics

Comprehensive analysis of your landing page conversion funnel and user behavior.

## Instructions

### 1. Check Google Tag Manager Setup

Verify GTM is properly configured in [layout.tsx](app/layout.tsx):

```bash
grep -A 10 "GTM" app/layout.tsx
```

**Should find:**
- GTM script in `<head>`
- GTM noscript in `<body>`
- Correct GTM ID (GTM-XXXXXXX)

**If missing or incorrect, this is CRITICAL for tracking.**

### 2. Identify Tracking Events

Search for all tracking events in product pages:

```bash
# Find GTM dataLayer pushes
grep -r "dataLayer.push" app/product --include="*.tsx"

# Find WhatsApp link clicks
grep -r "whatsapp" app/product --include="*.tsx"

# Find form submissions
grep -r "handleSubmit" app/product --include="*.tsx"
```

**Key events to track:**
1. Page view
2. Scroll depth (25%, 50%, 75%, 100%)
3. Color selection
4. Quantity change
5. Scroll to form
6. Form field interactions
7. Form submission
8. WhatsApp click
9. Order success

### 3. Analyze Conversion Funnel

**Create funnel tracking script** `scripts/analyze-funnel.ts`:

```typescript
/**
 * Conversion Funnel Analysis
 *
 * Funnel stages:
 * 1. Page Load
 * 2. Scroll to Product Gallery (engaged)
 * 3. Color Selection (interested)
 * 4. Scroll to Order Form (considering)
 * 5. Form Field Interaction (intending)
 * 6. Form Submission (converted)
 */

interface FunnelData {
  pageViews: number
  scrolledToGallery: number
  selectedColor: number
  scrolledToForm: number
  startedForm: number
  submittedForm: number
  whatsappClicks: number
}

function analyzeFunnel(data: FunnelData) {
  console.log('\n📊 Conversion Funnel Analysis\n')

  const stages = [
    { name: 'Page Views', count: data.pageViews },
    { name: 'Viewed Gallery', count: data.scrolledToGallery },
    { name: 'Selected Color', count: data.selectedColor },
    { name: 'Viewed Form', count: data.scrolledToForm },
    { name: 'Started Form', count: data.startedForm },
    { name: 'Submitted Order', count: data.submittedForm }
  ]

  stages.forEach((stage, index) => {
    const conversionRate = (stage.count / data.pageViews) * 100
    const dropoffRate = index > 0
      ? ((stages[index - 1].count - stage.count) / stages[index - 1].count) * 100
      : 0

    console.log(`${index + 1}. ${stage.name}`)
    console.log(`   Count: ${stage.count}`)
    console.log(`   Conversion: ${conversionRate.toFixed(1)}% of page views`)
    if (index > 0) {
      console.log(`   Drop-off: ${dropoffRate.toFixed(1)}% from previous stage`)
    }
    console.log('')
  })

  // Overall conversion rate
  const overallConversion = (data.submittedForm / data.pageViews) * 100
  console.log(`📈 Overall Conversion Rate: ${overallConversion.toFixed(2)}%`)

  // WhatsApp alternative
  const whatsappRate = (data.whatsappClicks / data.pageViews) * 100
  console.log(`💬 WhatsApp Click Rate: ${whatsappRate.toFixed(2)}%`)

  console.log(`\n🎯 Total Conversions: ${data.submittedForm + data.whatsappClicks}`)

  // Identify biggest drop-off point
  let biggestDropoff = { stage: '', rate: 0, index: 0 }
  stages.forEach((stage, index) => {
    if (index > 0) {
      const dropoff = ((stages[index - 1].count - stage.count) / stages[index - 1].count) * 100
      if (dropoff > biggestDropoff.rate) {
        biggestDropoff = { stage: stage.name, rate: dropoff, index }
      }
    }
  })

  console.log(`\n⚠️ Biggest Drop-off: ${biggestDropoff.stage} (${biggestDropoff.rate.toFixed(1)}%)`)

  // Recommendations
  console.log('\n💡 Recommendations:')
  if (biggestDropoff.index === 1) {
    console.log('   - Hero section not engaging enough')
    console.log('   - Improve video/image quality')
    console.log('   - Stronger value proposition above fold')
  } else if (biggestDropoff.index === 2) {
    console.log('   - Product gallery needs work')
    console.log('   - Make color options more prominent')
    console.log('   - Add better product photos')
  } else if (biggestDropoff.index === 3) {
    console.log('   - Not enough urgency to buy')
    console.log('   - Add scarcity (limited stock)')
    console.log('   - Stronger call-to-action')
  } else if (biggestDropoff.index === 4) {
    console.log('   - Form is intimidating')
    console.log('   - Reduce form fields')
    console.log('   - Add trust signals near form')
  } else if (biggestDropoff.index === 5) {
    console.log('   - Form completion issues')
    console.log('   - Check validation errors')
    console.log('   - Simplify checkout process')
  }
}

// Example usage with sample data
// In production, fetch this from GTM/GA4
const sampleData: FunnelData = {
  pageViews: 1000,
  scrolledToGallery: 750,
  selectedColor: 450,
  scrolledToForm: 350,
  startedForm: 280,
  submittedForm: 140,
  whatsappClicks: 85
}

analyzeFunnel(sampleData)
```

### 4. Check Page Load Performance

Run Lighthouse audit:

```bash
npm run build
npm run start &
sleep 5

# Run Lighthouse (install if needed: npm install -g lighthouse)
lighthouse http://localhost:3000/product/megir/gift --only-categories=performance --output=json --output-path=./lighthouse-report.json

# View results
cat lighthouse-report.json | grep "first-contentful-paint\|largest-contentful-paint\|total-blocking-time\|cumulative-layout-shift\|speed-index"
```

**Performance targets:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1
- Speed Index: < 3.0s

### 5. Analyze Form Abandonment

Create form analytics script `scripts/form-analytics.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
require('dotenv').config({ path: '.env.local' })

/**
 * Identifies potential form abandonment patterns
 * by analyzing successful orders vs. typical traffic
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function analyzeFormCompletion() {
  // Get orders for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString())

  console.log('\n📝 Form Completion Analysis\n')
  console.log(`Orders submitted: ${orders?.length || 0}`)

  // Analyze completion patterns
  const completionByProduct = new Map<string, number>()
  const completionByColor = new Map<string, number>()

  orders?.forEach(order => {
    completionByProduct.set(
      order.product_name,
      (completionByProduct.get(order.product_name) || 0) + 1
    )
    completionByColor.set(
      order.color,
      (completionByColor.get(order.color) || 0) + 1
    )
  })

  console.log('\n📦 Conversions by Product:')
  Array.from(completionByProduct.entries())
    .sort(([, a], [, b]) => b - a)
    .forEach(([product, count]) => {
      console.log(`   ${product}: ${count} orders`)
    })

  console.log('\n🎨 Conversions by Color:')
  Array.from(completionByColor.entries())
    .sort(([, a], [, b]) => b - a)
    .forEach(([color, count]) => {
      console.log(`   ${color}: ${count} orders`)
    })

  // Check for validation errors (would need error logging)
  console.log('\n💡 To improve form completion:')
  console.log('   - Add progress indicator')
  console.log('   - Show validation errors inline')
  console.log('   - Auto-save form data')
  console.log('   - Add "Save for later" option')
  console.log('   - Reduce required fields')
}

analyzeFormCompletion()
```

### 6. Test GTM Event Firing

Create GTM test script `scripts/test-gtm.ts`:

```typescript
/**
 * Verifies Google Tag Manager events are firing correctly
 *
 * Events to check:
 * - page_view
 * - scroll_depth
 * - color_selected
 * - quantity_changed
 * - form_started
 * - form_submitted
 * - whatsapp_clicked
 */

interface GTMEvent {
  event: string
  data?: Record<string, any>
}

const expectedEvents: GTMEvent[] = [
  { event: 'page_view' },
  { event: 'scroll_depth', data: { depth: 25 } },
  { event: 'scroll_depth', data: { depth: 50 } },
  { event: 'scroll_depth', data: { depth: 75 } },
  { event: 'scroll_depth', data: { depth: 100 } },
  { event: 'color_selected', data: { color: 'Navy Blue' } },
  { event: 'quantity_changed', data: { quantity: 2 } },
  { event: 'form_started' },
  { event: 'form_field_completed', data: { field: 'full_name' } },
  { event: 'form_submitted' },
  { event: 'whatsapp_clicked' }
]

console.log('\n🏷️ GTM Event Checklist\n')
console.log('Verify these events are implemented in your product pages:\n')

expectedEvents.forEach((event, index) => {
  const dataStr = event.data ? `: ${JSON.stringify(event.data)}` : ''
  console.log(`${index + 1}. ${event.event}${dataStr}`)
})

console.log('\n📝 Implementation Guide:\n')
console.log('Add to product page components:')
console.log(`
// Page view (in useEffect)
useEffect(() => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'page_view',
    page_type: 'product',
    product_name: 'MEGIR Gift Bundle'
  })
}, [])

// Color selection
const handleColorSelect = (color: string) => {
  setSelectedColor(color)
  window.dataLayer.push({
    event: 'color_selected',
    color: color
  })
}

// Form start
const handleFormFocus = () => {
  window.dataLayer.push({
    event: 'form_started'
  })
}

// Form submission
const handleSubmit = async (e) => {
  e.preventDefault()
  window.dataLayer.push({
    event: 'form_submitted',
    product_name: 'MEGIR Gift Bundle',
    value: totalPrice
  })
  // ... rest of submit logic
}
`)
}
```

### 7. Create Conversion Optimization Checklist

Generate a report of optimization opportunities:

```markdown
# Conversion Optimization Checklist

## 🎯 Above the Fold (Critical)
- [ ] Clear value proposition visible
- [ ] Hero image/video loads quickly (< 2s)
- [ ] Primary CTA button prominent
- [ ] Trust signals visible (warranty, reviews)
- [ ] Mobile-friendly (test on mobile device)

## 📸 Product Gallery
- [ ] High-quality images (optimized for web)
- [ ] Color options clearly visible
- [ ] Images zoom on click
- [ ] Alt text for all images
- [ ] Lazy loading implemented

## 💰 Pricing & Offers
- [ ] Discount badges prominent
- [ ] Savings calculation shown
- [ ] Quantity discount clear
- [ ] Price in Nigerian Naira (₦)
- [ ] No hidden fees

## 📝 Order Form
- [ ] Minimal required fields
- [ ] Inline validation
- [ ] Clear error messages
- [ ] Progress indicator
- [ ] Auto-complete enabled
- [ ] Mobile keyboard optimized
- [ ] Submit button always visible

## 🔒 Trust & Security
- [ ] Security badges displayed
- [ ] Warranty information
- [ ] Return policy clear
- [ ] Contact information visible
- [ ] Social proof (testimonials)
- [ ] WhatsApp alternative offered

## 🚀 Performance
- [ ] Page load < 3s
- [ ] Images optimized
- [ ] No layout shift (CLS < 0.1)
- [ ] Mobile responsive
- [ ] Fast form submission

## 📊 Analytics
- [ ] GTM installed
- [ ] All events tracking
- [ ] Conversion goals set
- [ ] Funnel analysis setup
- [ ] A/B testing ready

## 💬 WhatsApp Integration
- [ ] Button prominent
- [ ] Pre-filled message
- [ ] Order details included
- [ ] Easy to use on mobile
```

### 8. Monitor Real User Metrics

If using Vercel Analytics or similar:

```bash
# Check if Vercel Analytics is installed
grep "@vercel/analytics" package.json
```

**If not installed:**
```bash
npm install @vercel/analytics
```

**Add to [layout.tsx](app/layout.tsx):**
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 9. A/B Testing Recommendations

**Elements to test:**

1. **Hero Section**
   - Video vs. static image
   - Headline variations
   - CTA button color/text

2. **Pricing Display**
   - Show discount percentage vs. savings amount
   - Strikethrough original price
   - Bundle value visualization

3. **Form Length**
   - Required fields only vs. optional fields
   - Single page vs. multi-step
   - Email required vs. optional

4. **Trust Signals**
   - Testimonials location
   - Warranty prominence
   - Security badges

5. **CTA Button**
   - "Order Now" vs. "Get Yours"
   - Color variations
   - Size and placement

### 10. Generate Conversion Report

**Summary report format:**

```markdown
# Conversion Analysis Report
Date: [DATE]

## Key Metrics
- Overall Conversion Rate: X.XX%
- Page Load Time: X.Xs
- Form Completion Rate: XX%
- WhatsApp Click Rate: XX%

## Funnel Performance
Stage                    Conversion    Drop-off
1. Page Views            100.0%        -
2. Viewed Gallery        75.0%         25.0% ⚠️
3. Selected Color        45.0%         40.0% 🚨
4. Viewed Form           35.0%         22.2%
5. Started Form          28.0%         20.0%
6. Submitted Order       14.0%         50.0% 🚨

## Critical Issues
🚨 High drop-off from Gallery to Color Selection (40%)
   → Recommendation: Make color options more prominent

🚨 High form abandonment (50%)
   → Recommendation: Reduce required fields, add trust signals

## Performance
- LCP: 2.3s ✅
- FCP: 1.5s ✅
- TBT: 180ms ✅
- CLS: 0.08 ✅

## Top Performing
- Best Product: MEGIR Gift Bundle (48% of orders)
- Best Color: Navy Blue (44% of orders)
- Best Day: Saturday (highest conversion)

## Action Items
1. Improve color selector visibility
2. Reduce form fields
3. Add more trust signals
4. A/B test hero section
5. Implement exit-intent popup
```

## Notes

- Track conversions daily
- Monitor funnel drop-off points
- Test one change at a time
- Focus on mobile experience (likely majority of traffic)
- Use real user data, not assumptions
- Continuously optimize based on data
