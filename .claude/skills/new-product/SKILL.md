---
name: new-product
description: Interactive product page generator. Creates a new product landing page with the proven conversion-optimized structure, including page.tsx, layout.tsx, SEO metadata, and image directory setup. Prompts for product name, prices, colors, and bundle details. Use when the user wants to add a new product or create a product variant.
allowed-tools: Read, Write, Bash(mkdir:*), AskUserQuestion, Glob, TodoWrite
---

# New Product Page Generator

Quickly scaffold a new conversion-optimized product landing page following the proven BaaWA template structure.

## Instructions

### 1. Gather Product Information

Use AskUserQuestion to collect:

**Basic Information:**
- Product name (e.g., "MEGIR Watch", "Leather Wallet")
- Product category (watch, accessory, bundle, etc.)
- Is this a variant of an existing product? (yes/no)
- If variant, which product? (megir, etc.)

**Pricing:**
- Base price (single unit)
- 2-unit discount percentage (e.g., 15%)
- 3+ unit discount percentage (e.g., 30%)

**Color Options (ask how many, then collect each):**
- Color name (e.g., "Navy Blue")
- Hex color code (e.g., "#1B3A5F")
- Note/description (e.g., "Most popular for gifts")
- Number of images per color (usually 2)

**Bundle Details (if applicable):**
- Is this a bundle/gift package? (yes/no)
- If yes, list bundle items with:
  - Item name
  - Item value
  - Item description
  - Is it highlighted? (yes/no)

### 2. Determine Directory Structure

**For standalone product:**
```
app/product/[product-slug]/
├── page.tsx
├── layout.tsx
```

**For product variant:**
```
app/product/[base-product]/[variant-slug]/
├── page.tsx
├── layout.tsx
```

**Image directory:**
```
public/products/[product-slug]/
```

Create slug from product name: lowercase, replace spaces with hyphens.

### 3. Create Directory Structure

```bash
# For standalone product:
mkdir -p app/product/[product-slug]
mkdir -p public/products/[product-slug]

# For variant:
mkdir -p app/product/[base-product]/[variant-slug]
mkdir -p public/products/[product-slug]
```

### 4. Read Template Product Page

Read an existing product page as template:
- For regular product: `app/product/megir/page.tsx`
- For gift bundle: `app/product/megir/gift/page.tsx`
- For bundle variant: `app/product/megir/executive-bundle/page.tsx`

This ensures we follow the proven structure.

### 5. Generate page.tsx

Create the product page with these sections (based on template):

**Essential Structure:**
1. **"use client"** directive
2. **Imports** - useState, useEffect, Button, Card, icons
3. **State management**:
   - activeFaq
   - selectedColor
   - quantity
   - isSubmitting
   - showFloatingButton
   - Additional state for bundles (relationship, occasion, etc.)

4. **Price calculation function**:
   ```typescript
   const calculatePrice = () => {
     if (quantity === 1) {
       return { total: basePrice, display: "₦XX,XXX", discount: null, savings: null }
     } else if (quantity === 2) {
       const total = Math.round(basePrice * 2 * (1 - discountPercent2))
       const savings = (basePrice * 2) - total
       return { total, display: `₦${total.toLocaleString()}`, discount: "XX% OFF!", savings }
     } else {
       const total = Math.round(basePrice * quantity * (1 - discountPercent3))
       const savings = (basePrice * quantity) - total
       return { total, display: `₦${total.toLocaleString()}`, discount: "XX% OFF!", savings }
     }
   }
   ```

5. **Color options array**:
   ```typescript
   const colorOptions = [
     { name: 'Color1', color: '#HEXCODE', images: ['1', '2'], note: 'Note' },
     // ... more colors
   ]
   ```

6. **Bundle items array** (if bundle):
   ```typescript
   const bundleItems: Array<{ name: string; value: number; description: string; highlighted: boolean }> = [
     { name: 'Item 1', value: 10000, description: 'Desc', highlighted: true },
     // ... more items
   ]
   ```

7. **Scroll and UI handlers**:
   - scrollToOrderForm
   - handleColorSelect
   - useEffect for floating button
   - handleSubmit for form

8. **Page Sections** (in JSX):
   - Hero section with video/image
   - Problem/solution section
   - Product gallery with color selector
   - Bundle items showcase (if bundle)
   - Features and specifications
   - Social proof / testimonials
   - FAQ accordion
   - Order form with WhatsApp integration
   - Floating CTA button

### 6. Generate layout.tsx

Create SEO-optimized metadata:

```typescript
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: "[Product Name] - BaaWA Accessories",
  description: "[Compelling 150-160 char description highlighting key benefits]",
  openGraph: {
    title: "[Product Name] - BaaWA Accessories",
    description: "[Same description]",
    url: `${baseUrl}/product/[product-slug]`,
    siteName: 'BaaWA Accessories',
    images: [
      {
        url: `${baseUrl}/products/[product-slug]/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: '[Product Name]',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "[Product Name] - BaaWA Accessories",
    description: "[Same description]",
    images: [`${baseUrl}/products/[product-slug]/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

### 7. Create Image Directory Structure

In `public/products/[product-slug]/`, create:

```
public/products/[product-slug]/
├── README.md (instructions for adding images)
└── .gitkeep (to track empty dir)
```

Create README.md:
```markdown
# [Product Name] Images

## Required Images

### Color Option Images
For each color, add:
- `[color-number-1].jpg` - First product image
- `[color-number-2].jpg` - Second product image

Example for Navy Blue (images: ['1', '2']):
- `1.jpg`
- `2.jpg`

### Hero Section
- `hero-video.mp4` OR `hero-image.jpg`

### Open Graph
- `og-image.jpg` (1200x630px for social sharing)

## Optimization Guidelines
- Use WebP format for better compression
- Compress images before uploading
- Recommended max size: 500KB per image
- Use descriptive filenames

## Tools
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
```

### 8. Update Color References

Replace template placeholder images with new structure:

```tsx
// Change from:
src="/products/megir/15.jpg"

// To:
src="/products/[product-slug]/1.jpg"
```

### 9. Update API Product Name

In the form submit handler, update the product name:

```typescript
product_name: "[Product Name] - [Variant]"
```

### 10. Generate Summary and Next Steps

Provide user with:

```markdown
✅ Product Page Created: /product/[product-slug]

📁 Files Created:
- app/product/[product-slug]/page.tsx
- app/product/[product-slug]/layout.tsx
- public/products/[product-slug]/README.md

🎨 Color Options Configured:
- [List each color with hex code]

💰 Pricing Structure:
- 1 unit: ₦[price]
- 2 units: ₦[price] ([discount]% off)
- 3+ units: ₦[price] ([discount]% off)

📸 Next Steps:
1. Add product images to: public/products/[product-slug]/
   - See README.md in that folder for requirements
   - You need [X] images total

2. Customize the page content:
   - Update hero section copy
   - Add product features
   - Write FAQs
   - Add testimonials (if available)

3. Test the page:
   - Run: npm run dev
   - Visit: http://localhost:3000/product/[product-slug]
   - Test order form submission
   - Verify color switching works

4. SEO optimization:
   - Add og-image.jpg (1200x630px)
   - Review metadata in layout.tsx
   - Test social sharing preview

Ready to go live! 🚀
```

## Example Workflow

**User asks:** "Create a new product page for Leather Wallet Executive Bundle"

**Skill prompts for:**
1. Product name: "Leather Wallet"
2. Is variant?: Yes
3. Base product: "leather-wallet"
4. Variant name: "Executive Bundle"
5. Base price: 45000
6. 2-unit discount: 10%
7. 3+ unit discount: 20%
8. How many colors?: 2
9. Color 1: "Classic Brown", #8B4513, "Professional look"
10. Color 2: "Black", #000000, "Timeless elegance"
11. Images per color: 2
12. Is bundle?: Yes
13. Bundle items:
    - Leather Wallet, 35000, "Genuine leather", yes
    - Card Holder, 8000, "RFID protection", no
    - Gift Box, 5000, "Premium packaging", yes

**Skill creates:**
```
app/product/leather-wallet/executive-bundle/
├── page.tsx (1200+ lines with all sections)
├── layout.tsx (SEO metadata)

public/products/leather-wallet-executive-bundle/
├── README.md
└── .gitkeep
```

## Common Customizations

### Add Gift Bundle Fields

If product is a gift bundle, add to form:

```tsx
<div>
  <Label htmlFor="gift_recipient">Who is this gift for?</Label>
  <Input id="gift_recipient" name="gift_recipient" />
</div>

<div>
  <Label htmlFor="gift_relationship">Your relationship</Label>
  <Select name="gift_relationship">
    {relationships.map(rel => (
      <option key={rel} value={rel}>{rel}</option>
    ))}
  </Select>
</div>

<div>
  <Label htmlFor="gift_message">Personal message (optional)</Label>
  <Textarea id="gift_message" name="gift_message" maxLength={500} />
</div>
```

### Add Metadata to Order Submission

For bundles:

```typescript
const metadata = {
  gift_recipient: formData.get('gift_recipient'),
  gift_relationship: formData.get('gift_relationship'),
  gift_message: formData.get('gift_message'),
  occasion: formData.get('occasion'),
  delivery_date: formData.get('delivery_date')
}
```

## Notes

- Always base new products on existing templates
- Follow the 1200-line conversion-optimized structure
- Each product gets its own layout for SEO
- Images are lazy-loaded for performance
- WhatsApp integration is primary conversion path
- Test order flow after creating product
- Add Google Tag Manager events for tracking
