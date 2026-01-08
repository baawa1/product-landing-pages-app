# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 14+ landing pages app for BaaWA Accessories products. Conversion-optimized product pages with integrated order processing and Supabase backend.

## Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Production
npm run build            # Build for production
npm start                # Run production build

# Code Quality
npm run lint             # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Base UI React)
- **Backend**: Supabase (PostgreSQL with RLS)
- **Analytics**: Google Tag Manager

### Directory Structure
```
app/
├── product/megir/           # Product landing pages
│   ├── page.tsx            # Base MEGIR watch page
│   ├── gift/               # Gift bundle variant
│   ├── executive-bundle/   # Executive bundle variant
│   ├── success-bundle/     # Success bundle variant
│   └── success-mindset/    # Success mindset variant
├── api/orders/route.ts     # Order processing endpoint
├── thank-you/              # Order confirmation page
├── layout.tsx              # Root layout with fonts & GTM
└── page.tsx                # Homepage

components/ui/              # shadcn/ui components
lib/
├── supabase.ts            # Supabase clients & order functions
└── utils.ts               # Utility functions (cn)
public/products/megir/     # Product images & videos
```

### Key Patterns

#### Product Pages
All product pages are client components (`"use client"`) with a consistent structure:
1. **Hero Section** - Video/image with primary CTA
2. **Problem/Solution** - Why customer needs this product
3. **Product Gallery** - Color options with image previews
4. **Bundle Items** (for bundles) - What's included with values
5. **Features & Specs** - Technical details
6. **Social Proof** - Testimonials
7. **FAQ Section** - Collapsible Q&A
8. **Order Form** - Form with WhatsApp integration

Product pages use:
- State management for color selection, quantity, FAQs
- Scroll-triggered floating CTA button
- Smooth scrolling to order form
- Dynamic pricing calculations with quantity discounts

#### Order Processing Flow
1. Form submit → `/app/api/orders/route.ts` POST endpoint
2. Server validates required fields
3. Graceful degradation if Supabase not configured (logs warning)
4. Uses `supabaseAdmin` client to bypass RLS when saving orders
5. Returns order ID on success
6. Client redirects to `/thank-you` page

#### Supabase Integration
- **Two clients**: `supabase` (client-side) and `supabaseAdmin` (server-side, bypasses RLS)
- Orders table has `metadata` JSONB field for flexible data (gift info, bundle details, etc.)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- App works without Supabase configured (logs warning, skips database save)

#### Order Metadata Structure
Gift bundles use the `metadata` field:
```typescript
metadata: {
  gift_recipient?: string      // Who the gift is for
  gift_relationship?: string   // Relationship to recipient
  gift_message?: string        // Personal message
  occasion?: string           // Gift occasion
  delivery_date?: string      // Requested delivery date
  [key: string]: any         // Extensible for new fields
}
```

#### Layout Nesting
Each product has its own layout.tsx for:
- Custom metadata (title, description, OG images)
- Product-specific SEO
- Prevents layout shifts between product pages

### Image Handling
- Product images stored in `/public/products/[product-name]/`
- Referenced as `/products/[product-name]/image.jpg`
- Optimize images before adding (WebP preferred)
- Videos use HTML5 video tag with `autoPlay muted loop playsInline`

### Styling Conventions
- Tailwind CSS with custom fonts: Inter (sans), Geist Sans, Geist Mono
- Mobile-first responsive design
- Color palette defined in globals.css
- Use `cn()` utility from `lib/utils.ts` for conditional classes

## Adding New Products

To add a new product page:

1. Create directory: `app/product/[product-name]/`
2. Add `page.tsx` (follow existing product structure)
3. Add `layout.tsx` with product-specific metadata
4. Upload images to `public/products/[product-name]/`
5. Update order form to use correct product name in API call

For product variants (bundles):
- Create subdirectory: `app/product/[product-name]/[variant]/`
- Use `metadata` field in orders to store variant-specific data
- Follow gift bundle pattern for additional form fields

## Environment Variables

Required for full functionality:
```
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server-only)
NEXT_PUBLIC_BASE_URL=             # Base URL for metadata (defaults to localhost:3000)
```

App gracefully degrades if Supabase vars not set (orders log warning instead of saving).

## Database Schema

The `orders` table structure:
- `id` - Sequential integer (primary key)
- `created_at` - Timestamp
- `full_name`, `phone`, `email`, `state`, `address` - Customer info
- `product_name`, `color`, `quantity`, `price`, `total_price` - Order details
- `discount`, `discount_amount` - Discount tracking
- `status` - Order status (pending/confirmed/shipped/delivered)
- `metadata` - JSONB for flexible product-specific data

Recent schema change: ID field changed from UUID to sequential integer for easier order tracking.

## Important Notes

- Always use `supabaseAdmin` client in API routes to bypass Row Level Security
- Product pages are large (1000-1500 lines) - this is intentional for conversion optimization
- WhatsApp order flow is primary conversion path (not traditional checkout)
- Google Tag Manager configured in root layout for tracking
- Floating CTA button appears when hero scrolled past but form not yet visible
