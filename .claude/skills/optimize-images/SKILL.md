---
name: optimize-images
description: Automatically optimizes product images for web. Finds large images, converts to WebP format, generates responsive sizes (mobile/tablet/desktop), updates references in code, and reports size savings. Use when images are slow to load, before deployment, or when adding new product images.
allowed-tools: Read, Edit, Write, Bash(npm install:*), Bash(npx sharp-cli:*), Bash(find:*), Bash(du:*), Grep, TodoWrite
---

# Image Optimization

Automatically optimize product images for faster page loads and better user experience.

## Instructions

### 1. Install Image Optimization Tools

Install Sharp (fast image processing library):

```bash
npm install --save-dev sharp sharp-cli
```

### 2. Scan Product Images

Find all product images and their sizes:

```bash
# Find all images in public/products
find public/products -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \)

# Find large images (>500KB)
find public/products -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k -exec ls -lh {} \;

# Calculate total size
du -sh public/products/
```

**Report findings:**
```
📊 Image Inventory
- Total images: XX
- Total size: XX MB
- Images >500KB: XX
- Largest image: XXX KB
```

### 3. Create Optimization Script

Create `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const QUALITY = 80 // WebP quality (0-100)
const SIZES = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920
}

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const dir = path.dirname(inputPath)

  console.log(`\n🖼️  Optimizing: ${inputPath}`)

  try {
    // Get original size
    const originalStats = fs.statSync(inputPath)
    const originalSize = originalStats.size

    // Convert to WebP (default size)
    const webpPath = path.join(dir, `${filename}.webp`)
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(webpPath)

    const webpStats = fs.statSync(webpPath)
    const webpSize = webpStats.size
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)

    console.log(`  ✅ Created: ${filename}.webp`)
    console.log(`     Original: ${(originalSize / 1024).toFixed(1)} KB`)
    console.log(`     WebP: ${(webpSize / 1024).toFixed(1)} KB`)
    console.log(`     Saved: ${savings}%`)

    // Generate responsive sizes
    for (const [sizeName, width] of Object.entries(SIZES)) {
      const responsivePath = path.join(dir, `${filename}-${sizeName}.webp`)
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(responsivePath)

      console.log(`  📱 Created: ${filename}-${sizeName}.webp (${width}px)`)
    }

    return {
      original: originalSize,
      optimized: webpSize,
      savings: originalSize - webpSize
    }

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return null
  }
}

async function optimizeAllImages() {
  const productsDir = path.join(process.cwd(), 'public/products')

  // Find all images
  const findImages = (dir) => {
    const files = []
    const items = fs.readdirSync(dir)

    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findImages(fullPath))
      } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
        files.push(fullPath)
      }
    })

    return files
  }

  const images = findImages(productsDir)

  console.log(`\n🚀 Starting optimization...`)
  console.log(`Found ${images.length} images to optimize\n`)

  let totalOriginal = 0
  let totalOptimized = 0
  let successCount = 0

  for (const imagePath of images) {
    const result = await optimizeImage(imagePath)
    if (result) {
      totalOriginal += result.original
      totalOptimized += result.optimized
      successCount++
    }
  }

  const totalSavings = totalOriginal - totalOptimized
  const savingsPercent = ((totalSavings / totalOriginal) * 100).toFixed(1)

  console.log(`\n📊 Optimization Complete!`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Images processed: ${successCount}/${images.length}`)
  console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`)
  console.log(`\n✨ WebP images created with responsive sizes!`)
}

optimizeAllImages().catch(console.error)
```

### 4. Run Optimization

Execute the optimization script:

```bash
node scripts/optimize-images.js
```

### 5. Update Image References in Code

After optimization, update product pages to use WebP with fallbacks:

**Find all image references:**
```bash
grep -r 'src="/products/' app/product --include="*.tsx"
```

**Update to use WebP with fallback:**

**Before:**
```tsx
<img src="/products/megir/1.jpg" alt="MEGIR Watch Navy Blue" />
```

**After:**
```tsx
<picture>
  <source
    srcSet="/products/megir/1-mobile.webp 640w,
            /products/megir/1-tablet.webp 1024w,
            /products/megir/1-desktop.webp 1920w"
    type="image/webp"
    sizes="(max-width: 640px) 640px,
           (max-width: 1024px) 1024px,
           1920px"
  />
  <img
    src="/products/megir/1.jpg"
    alt="MEGIR Watch Navy Blue"
    loading="lazy"
  />
</picture>
```

**Or use Next.js Image component (recommended):**
```tsx
import Image from 'next/image'

<Image
  src="/products/megir/1.webp"
  alt="MEGIR Watch Navy Blue"
  width={800}
  height={800}
  quality={80}
  loading="lazy"
  sizes="(max-width: 640px) 640px,
         (max-width: 1024px) 1024px,
         1920px"
/>
```

### 6. Create Image Component Helper

Create `components/ProductImage.tsx`:

```tsx
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function ProductImage({
  src,
  alt,
  priority = false,
  className = ''
}: ProductImageProps) {
  // Convert .jpg/.png to .webp
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp')

  return (
    <Image
      src={webpSrc}
      alt={alt}
      width={800}
      height={800}
      quality={80}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
    />
  )
}
```

**Usage in product pages:**
```tsx
import { ProductImage } from '@/components/ProductImage'

<ProductImage
  src="/products/megir/1.jpg"
  alt="MEGIR Watch Navy Blue"
  priority={index === 0} // First image loads immediately
/>
```

### 7. Optimize Videos

If you have product videos:

```bash
# Install ffmpeg (if not already installed)
# macOS: brew install ffmpeg
# Ubuntu: apt-get install ffmpeg

# Create video optimization script
```

Create `scripts/optimize-videos.sh`:

```bash
#!/bin/bash

# Optimize product videos

for video in public/products/**/*.mp4; do
  if [ -f "$video" ]; then
    echo "Optimizing: $video"

    # Get filename without extension
    filename="${video%.*}"

    # Compress video (maintain quality, reduce size)
    ffmpeg -i "$video" \
      -c:v libx264 \
      -crf 23 \
      -preset slow \
      -c:a aac \
      -b:a 128k \
      "${filename}-optimized.mp4" \
      -y

    # Get sizes
    original_size=$(du -h "$video" | cut -f1)
    optimized_size=$(du -h "${filename}-optimized.mp4" | cut -f1)

    echo "  Original: $original_size"
    echo "  Optimized: $optimized_size"
    echo ""
  fi
done

echo "✅ Video optimization complete!"
```

Make executable and run:
```bash
chmod +x scripts/optimize-videos.sh
./scripts/optimize-videos.sh
```

### 8. Add Image Loading Strategy

Update product pages to lazy-load images:

```tsx
// Hero image - load immediately
<img src="/products/megir/hero.webp" loading="eager" fetchPriority="high" />

// Gallery images - lazy load
{colorOptions.map((option, index) => (
  <img
    key={option.name}
    src={`/products/megir/${option.images[0]}.webp`}
    loading="lazy"
    decoding="async"
  />
))}
```

### 9. Generate Optimization Report

Create summary of improvements:

```markdown
# Image Optimization Report

## Before Optimization
- Total images: XX
- Total size: XX.XX MB
- Largest image: XXX KB
- Average size: XX KB

## After Optimization
- Total images: XX (+ XX responsive variants)
- Total size: XX.XX MB (WebP)
- Largest image: XXX KB
- Average size: XX KB

## Results
- **Size reduction: XX.XX MB (XX%)**
- **Page load improvement: estimated X.Xs faster**
- **Bandwidth savings: XX% per page load**

## Formats Created
✅ WebP (modern browsers)
✅ Responsive sizes (mobile, tablet, desktop)
✅ Original formats (fallback)

## Next Steps
1. ✅ Updated all product pages to use WebP
2. ✅ Added lazy loading
3. ✅ Implemented responsive images
4. ⏳ Monitor page load times
5. ⏳ A/B test impact on conversions
```

### 10. Add npm Scripts

Add to [package.json](package.json):

```json
{
  "scripts": {
    "images:optimize": "node scripts/optimize-images.js",
    "images:analyze": "find public/products -type f \\( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \\) -exec du -h {} \\; | sort -hr",
    "images:large": "find public/products -type f \\( -name '*.jpg' -o -name '*.png' \\) -size +500k -exec ls -lh {} \\;"
  }
}
```

**Usage:**
```bash
# Optimize all images
npm run images:optimize

# Analyze image sizes
npm run images:analyze

# Find large images
npm run images:large
```

## Optimization Checklist

- [ ] All images < 500KB
- [ ] WebP format for all modern browsers
- [ ] Fallback to JPG/PNG for older browsers
- [ ] Responsive images (mobile, tablet, desktop)
- [ ] Lazy loading on non-critical images
- [ ] Priority loading on hero images
- [ ] Alt text on all images
- [ ] Proper aspect ratios (no layout shift)
- [ ] Image compression quality 75-85
- [ ] Next.js Image component used

## Best Practices

### Image Sizes
- **Hero images:** 1920x1080px max
- **Product images:** 800x800px
- **Thumbnails:** 200x200px
- **OG images:** 1200x630px

### File Sizes
- **Hero:** < 200KB
- **Product:** < 100KB
- **Thumbnail:** < 20KB
- **OG image:** < 150KB

### Formats
1. **WebP** - Best compression, modern browsers
2. **AVIF** - Better than WebP, limited support
3. **JPG** - Fallback for photos
4. **PNG** - Fallback for graphics/transparency

### Loading Strategy
- **Above fold:** `loading="eager"`, `fetchPriority="high"`
- **Below fold:** `loading="lazy"`
- **Decorative:** `loading="lazy"`, `decoding="async"`

## Common Issues

### Issue: WebP not supported
**Solution:** Always provide fallback
```tsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

### Issue: Images too large
**Solution:** Resize before optimization
```bash
npx sharp-cli resize 800 800 input.jpg -o output.jpg
```

### Issue: Slow upload
**Solution:** Compress before uploading
```bash
npx sharp-cli -i input.jpg -o output.webp --webp-quality 80
```

## Tools

- **Sharp:** Image processing (Node.js)
- **Squoosh:** Online image optimizer
- **TinyPNG:** PNG/JPG compression
- **ImageOptim:** macOS app
- **SVGOMG:** SVG optimization

## Notes

- Run optimization before every deployment
- Test on mobile devices (largest impact)
- Monitor Core Web Vitals (LCP improvement)
- Keep original images backed up
- Optimize new images as added
- Re-optimize if quality issues reported
