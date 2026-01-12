/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const QUALITY = 80 // WebP quality (0-100)
const SIZES = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920
}

async function optimizeImage(inputPath) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const dir = path.dirname(inputPath)

  // Check if WebP version already exists
  const webpPath = path.join(dir, `${filename}.webp`)
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  Skipping: ${filename} (WebP already exists)`)
    return null
  }

  console.log(`\n🖼️  Optimizing: ${inputPath}`)

  try {
    // Get original size
    const originalStats = fs.statSync(inputPath)
    const originalSize = originalStats.size

    // Convert to WebP (default size)
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
  const publicDir = path.join(process.cwd(), 'public')

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
        // Skip favicon and apple-touch-icon (no need to optimize)
        if (!item.includes('favicon') && !item.includes('apple-touch-icon')) {
          files.push(fullPath)
        }
      }
    })

    return files
  }

  const images = findImages(publicDir)

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
