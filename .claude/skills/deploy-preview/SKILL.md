---
name: deploy-preview
description: Comprehensive pre-deployment validation. Runs lint and build, checks bundle size, verifies environment variables, scans for security issues, tests critical paths, and optionally creates deployment preview. Use before deploying to production or when the user wants to prepare for deployment.
allowed-tools: Bash(npm run lint:*), Bash(npm run build:*), Bash(npm run start:*), Bash(du:*), Bash(ls:*), Read, Grep, TodoWrite
---

# Deploy Preview & Validation

Comprehensive pre-deployment checks to ensure your app is production-ready.

## Instructions

### 1. Initialize Deployment Checklist

Create a todo list with all deployment checks:
- Run ESLint
- Build production bundle
- Check bundle size
- Validate environment variables
- Security scan
- Test critical API endpoints
- Verify image optimization
- Check for console.logs
- Validate metadata/SEO

### 2. Run Lint Check

```bash
npm run lint
```

**If lint fails:**
- Review errors
- Fix automatically if possible using `eslint --fix`
- Report issues that need manual intervention

**Expected output:**
```
✅ ESLint passed with no errors
```

### 3. Build Production Bundle

```bash
npm run build
```

**Monitor for:**
- Build errors (TypeScript, missing dependencies)
- Build warnings (unused variables, etc.)
- Route generation issues
- Image optimization errors

**Expected output:**
```
✅ Production build successful
Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB        XXX kB
├ ○ /product/megir                       XXX kB        XXX kB
├ ○ /product/megir/gift                  XXX kB        XXX kB
└ ○ /thank-you                           XXX kB        XXX kB
```

### 4. Analyze Bundle Size

Check build output sizes:

```bash
du -sh .next/
ls -lh .next/static/chunks/
```

**Thresholds:**
- ⚠️ Warning: First Load JS > 300 KB
- 🚨 Critical: First Load JS > 500 KB

**Report:**
```
📦 Bundle Size Analysis
- Total build size: XX MB
- Largest routes:
  1. /product/megir/gift: XXX kB
  2. /product/megir/executive-bundle: XXX kB
- Static assets: XX MB
- Status: ✅ Within limits / ⚠️ Large bundle / 🚨 Too large
```

**If too large, recommend:**
- Enable gzip/brotli compression
- Code splitting
- Image optimization
- Remove unused dependencies

### 5. Validate Environment Variables

Run the `/validate-env` skill or check manually:

```bash
# Check all required vars are set
[ -z "$NEXT_PUBLIC_SUPABASE_URL" ] && echo "❌ Missing SUPABASE_URL" || echo "✅ SUPABASE_URL set"
[ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] && echo "❌ Missing ANON_KEY" || echo "✅ ANON_KEY set"
[ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "❌ Missing SERVICE_KEY" || echo "✅ SERVICE_KEY set"
```

**Critical checks:**
- No placeholder values
- Production Supabase project (not dev/staging)
- `NEXT_PUBLIC_BASE_URL` is production domain
- No development URLs

### 6. Security Scan

Quick security check:

```bash
# Check for exposed secrets
grep -r "placeholder-key" app/ lib/

# Check for console.log (shouldn't be in production)
grep -r "console.log" app/ lib/ | grep -v node_modules | grep -v ".next"

# Check for hardcoded credentials
grep -r "password\s*=\s*['\"]" app/ lib/

# Check for TODO/FIXME comments
grep -r "TODO\|FIXME" app/ lib/ | grep -v node_modules
```

**Report any findings:**
- 🚨 Secrets or credentials: BLOCK deployment
- ⚠️ console.log statements: Recommend removal
- ℹ️ TODO comments: Inform user

### 7. Check Dependencies for Vulnerabilities

```bash
npm audit --production
```

**Report:**
- Critical vulnerabilities: BLOCK deployment
- High vulnerabilities: WARN user
- Medium/Low: Inform only

**If vulnerabilities found:**
```bash
npm audit fix
npm audit fix --force  # If needed (with user permission)
```

### 8. Verify Image Optimization

Check product images:

```bash
# Find large images (>500KB)
find public/products -type f \( -name "*.jpg" -o -name "*.png" \) -size +500k

# Count images
find public/products -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) | wc -l
```

**Report:**
- Number of images
- Large images (>500KB) that should be optimized
- Recommend WebP conversion if not done

### 9. Test Critical Endpoints (Optional)

If dev server is running, test key pages:

```bash
# Start production build
npm run start &
sleep 5

# Test homepage
curl -I http://localhost:3000/

# Test API endpoint
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Kill server
pkill -f "next start"
```

**Expected:**
- Homepage: 200 OK
- API: 400 (validation error for test data)

### 10. Validate SEO & Metadata

Check that each product page has proper metadata:

```bash
# Check for Open Graph images
find app/product -name "layout.tsx" -exec grep -l "openGraph" {} \;

# Verify og-image files exist
find public/products -name "og-image.jpg"
```

**Ensure every product has:**
- `title` in layout.tsx
- `description` in layout.tsx
- `openGraph` with image
- `twitter` card metadata
- `robots` configuration

### 11. Check Build Artifacts

Verify .next directory is clean:

```bash
ls -la .next/
```

**Should NOT contain:**
- Source maps in production (unless needed)
- Development files
- Cache from failed builds

**Clean build if needed:**
```bash
rm -rf .next
npm run build
```

### 12. Generate Deployment Report

Create comprehensive report:

```markdown
# Deployment Readiness Report
Date: [DATE]
Build: Production

## ✅ Passed Checks (X/10)
- ESLint: No errors
- Build: Successful
- Bundle size: Within limits (XXX kB)
- Environment variables: Configured correctly
- Dependencies: No critical vulnerabilities
- Images: Optimized
- SEO: Metadata present
- API endpoints: Responding

## ⚠️ Warnings (X)
- 5 console.log statements found (non-blocking)
- 2 images > 500KB (recommend optimization)
- 3 TODO comments in code

## 🚨 Blockers (X)
- None! Ready to deploy ✓

## Bundle Size Details
Route                                    First Load JS
/                                        142 kB
/product/megir                           245 kB
/product/megir/gift                      287 kB
/product/megir/executive-bundle          283 kB
/thank-you                               156 kB

Largest: /product/megir/gift (287 kB)
Status: ✅ Within acceptable range

## Environment Check
✅ NEXT_PUBLIC_SUPABASE_URL: Configured
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Configured
✅ SUPABASE_SERVICE_ROLE_KEY: Configured
✅ NEXT_PUBLIC_BASE_URL: https://baawa.com
✅ No placeholder values detected

## Security
✅ No secrets in code
✅ No hardcoded credentials
⚠️ 5 console.log statements (recommend removal)
✅ Dependencies: 0 critical, 0 high, 2 moderate

## Recommendations
1. Remove console.log statements before deploy
2. Optimize 2 large product images
3. Consider adding Sentry for production error tracking

## Deployment Approval
Status: ✅ **APPROVED FOR DEPLOYMENT**

Next steps:
1. Commit final changes
2. Push to main branch
3. Deploy to Vercel/Netlify
4. Monitor first hour for errors
5. Test order flow in production
```

### 13. Pre-Deploy Commands Summary

Quick checklist for user:

```bash
# 1. Clean build
rm -rf .next
npm run build

# 2. Lint check
npm run lint

# 3. Security audit
npm audit --production

# 4. Test locally
npm run start
# Visit http://localhost:3000 and test order flow

# 5. Deploy (if using Vercel)
vercel --prod

# 6. Post-deploy smoke test
curl -I https://yourdomain.com/
```

## Common Issues & Solutions

### Issue: Build fails with TypeScript errors

```
🚨 Build failed: Type errors found

Solution:
1. Run: npx tsc --noEmit
2. Fix type errors in reported files
3. Rebuild: npm run build
```

### Issue: Bundle too large (>500KB)

```
⚠️ Warning: First Load JS exceeds 500KB

Solutions:
1. Enable dynamic imports:
   import dynamic from 'next/dynamic'
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))

2. Optimize images:
   npm run optimize-images  # Use the /optimize-images skill

3. Remove unused dependencies:
   npm uninstall [unused-package]
```

### Issue: Environment variables not set

```
🚨 Critical: Production env vars not configured

Solution:
1. Copy .env.local to deployment platform
2. In Vercel: Settings > Environment Variables
3. Add all variables from .env.local
4. Redeploy
```

### Issue: npm audit shows vulnerabilities

```
⚠️ 5 vulnerabilities found (2 high)

Solution:
1. Try automatic fix: npm audit fix
2. If that fails: npm audit fix --force
3. Test after updating: npm run build
4. If breaking changes, update code accordingly
```

### Issue: Images not loading in production

```
❌ Product images showing 404

Check:
1. Images are in public/ directory
2. Paths start with / (not ./)
3. Image names match exactly (case-sensitive)
4. Images committed to git
```

## Deployment Platforms

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# First deployment
vercel

# Production deployment
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Environment variables: Set in Netlify UI
# Site settings > Environment variables
```

## Post-Deployment Checklist

After deploying:

1. ✅ Visit production URL - homepage loads
2. ✅ Test a product page - images load
3. ✅ Submit a test order - saves to database
4. ✅ Check Supabase dashboard - test order appears
5. ✅ Test WhatsApp link - opens correctly
6. ✅ Check mobile responsiveness
7. ✅ Test all product variants
8. ✅ Verify GTM tracking fires
9. ✅ Check browser console - no errors
10. ✅ Test from different locations/devices

## Rollback Plan

If deployment fails:

```bash
# Vercel
vercel rollback [deployment-url]

# Netlify
netlify deploy --prod --alias previous-version

# Manual
git revert HEAD
git push origin main
```

## Notes

- Always test in staging before production
- Keep .env.example updated for team
- Monitor Supabase after deploy for errors
- Check Vercel/Netlify logs if issues occur
- Test order flow immediately after deploy
- Have rollback plan ready
