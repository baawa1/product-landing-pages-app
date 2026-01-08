# BaaWA Landing Page - Custom Skills

This directory contains 12 custom Claude Code skills designed specifically for the BaaWA Accessories landing page project.

## 🔒 Security Skills

### 1. `/security-audit`
Comprehensive security check of your Next.js app.

**What it does:**
- Scans for XSS vulnerabilities
- Checks for SQL injection risks
- Finds exposed secrets
- Verifies rate limiting
- Reviews CORS configuration
- Checks CSRF protection
- Validates environment variables
- Scans dependencies

**When to use:**
- Before every production deployment
- After adding new features
- When security is mentioned
- Monthly security reviews

**Usage:**
```
Ask Claude: "Run a security audit"
```

---

### 2. `/validate-env`
Validates environment variable configuration.

**What it does:**
- Checks all required env vars are set
- Detects placeholder values
- Verifies no secrets in git
- Ensures .env.example is up-to-date
- Validates variable prefixes (NEXT_PUBLIC_)

**When to use:**
- Before deployment
- When orders aren't saving
- Setting up new environment
- After cloning project

**Usage:**
```
Ask Claude: "Validate my environment variables"
```

---

### 3. `/sanitize-inputs`
Adds comprehensive input validation and sanitization.

**What it does:**
- Installs Zod and validator libraries
- Creates validation schemas
- Adds Nigerian phone validation
- Implements XSS prevention
- Adds rate limiting
- Updates API routes with validation

**When to use:**
- Adding new forms
- Fixing security issues
- Before production launch
- When validation mentioned

**Usage:**
```
Ask Claude: "Add input sanitization to the order form"
```

---

## ⚡ Development Skills

### 4. `/new-product`
Interactive product page generator.

**What it does:**
- Prompts for product details (name, prices, colors)
- Generates page.tsx with full structure
- Creates layout.tsx with SEO metadata
- Sets up image directories
- Follows proven conversion template

**When to use:**
- Adding new product pages
- Creating product variants
- Launching new products

**Usage:**
```
Ask Claude: "Create a new product page for Leather Wallet"
```

---

### 5. `/test-order-flow`
End-to-end order flow testing.

**What it does:**
- Creates test order script
- Tests API validation
- Checks Supabase insertion
- Verifies discount calculations
- Tests metadata structure
- Validates WhatsApp formatting
- Auto-cleans test data

**When to use:**
- After API changes
- Before deployment
- When orders fail
- Testing new features

**Usage:**
```
Ask Claude: "Test the order flow"
```

---

### 6. `/deploy-preview`
Pre-deployment validation suite.

**What it does:**
- Runs lint and build
- Checks bundle size
- Validates environment
- Security scan
- Tests API endpoints
- Checks image optimization
- Validates SEO metadata

**When to use:**
- Before every deployment
- After major changes
- Weekly production checks

**Usage:**
```
Ask Claude: "Prepare for deployment"
Ask Claude: "Run deploy preview"
```

---

## 🗄️ Database Skills

### 7. `/db-migrate`
Supabase migration helper.

**What it does:**
- Generates migration files
- Tests migrations locally
- Applies to production safely
- Handles rollbacks
- Updates TypeScript types

**When to use:**
- Modifying database schema
- Adding table columns
- Creating new tables
- Database structure changes

**Usage:**
```
Ask Claude: "Add tracking_number column to orders table"
```

---

### 8. `/sync-types`
Syncs TypeScript types from Supabase.

**What it does:**
- Pulls latest schema from Supabase
- Generates database.types.ts
- Updates Order interface
- Validates types across codebase
- Ensures type safety

**When to use:**
- After database migrations
- When types are out of sync
- Setting up new environment
- Type errors appear

**Usage:**
```
Ask Claude: "Sync types with Supabase"
```

---

## 📊 Analytics & Monitoring Skills

### 9. `/check-orders`
CLI dashboard for order data.

**What it does:**
- Shows recent orders
- Revenue summary (today/week/month)
- Order status distribution
- Popular products/colors
- Growth trends
- Export to CSV/JSON

**When to use:**
- Checking daily orders
- Viewing sales data
- Analyzing trends
- Exporting for accounting

**Usage:**
```
Ask Claude: "Show me today's orders"
Ask Claude: "Check orders for last week"
```

**Direct commands:**
```bash
npm run orders        # Last 7 days
npm run orders:today  # Today only
npm run orders:month  # Last 30 days
```

---

### 10. `/analyze-conversions`
Conversion funnel and analytics.

**What it does:**
- Analyzes conversion funnel
- Checks GTM event tracking
- Measures page performance
- Identifies drop-off points
- Recommends optimizations

**When to use:**
- Optimizing conversion rates
- Understanding user behavior
- After design changes
- Monthly performance reviews

**Usage:**
```
Ask Claude: "Analyze conversion rates"
```

---

## 🎨 Optimization Skills

### 11. `/optimize-images`
Automatic image optimization.

**What it does:**
- Converts images to WebP
- Generates responsive sizes
- Compresses files
- Updates code references
- Shows size savings

**When to use:**
- Before deployment
- When pages load slowly
- Adding new product images
- Performance optimization

**Usage:**
```
Ask Claude: "Optimize all product images"
```

**Direct command:**
```bash
npm run images:optimize
```

---

### 12. `/check-accessibility`
WCAG 2.1 AA accessibility audit.

**What it does:**
- Checks alt text on images
- Validates color contrast
- Tests keyboard navigation
- Verifies ARIA labels
- Checks screen reader compatibility
- Runs automated Pa11y tests

**When to use:**
- Before launch
- After UI changes
- SEO optimization
- Compliance requirements

**Usage:**
```
Ask Claude: "Run accessibility audit"
```

---

## Quick Reference

### Security & Pre-Deployment
```
/security-audit     → Full security scan
/validate-env       → Check environment config
/sanitize-inputs    → Add input validation
/deploy-preview     → Pre-deployment checks
```

### Development
```
/new-product        → Create product page
/test-order-flow    → Test order submission
/db-migrate         → Database migrations
/sync-types         → Sync TS types
```

### Analytics & Monitoring
```
/check-orders       → View order dashboard
/analyze-conversions → Conversion analytics
```

### Optimization
```
/optimize-images    → Compress images
/check-accessibility → A11y audit
```

---

## Recommended Workflow

### Daily Development
1. `/test-order-flow` - Verify orders work
2. `/check-orders` - Monitor sales

### Before Deployment
1. `/security-audit` - Check for vulnerabilities
2. `/validate-env` - Ensure config is correct
3. `/deploy-preview` - Full pre-deployment check
4. `/optimize-images` - Ensure images optimized
5. `/check-accessibility` - Verify accessibility

### After Database Changes
1. `/db-migrate` - Apply schema changes
2. `/sync-types` - Update TypeScript types
3. `/test-order-flow` - Test everything still works

### Performance Optimization
1. `/analyze-conversions` - Find bottlenecks
2. `/optimize-images` - Reduce load times
3. `/check-accessibility` - Improve UX

---

## Installation

All skills are already installed in `.claude/skills/`. They will be automatically loaded by Claude Code.

**To use a skill:**
Simply ask Claude naturally:
- "Run a security audit"
- "Create a new product page"
- "Check today's orders"
- "Optimize images"

Claude will automatically invoke the appropriate skill.

---

## File Structure

```
.claude/skills/
├── README.md                    # This file
├── security-audit/
│   └── SKILL.md
├── validate-env/
│   └── SKILL.md
├── sanitize-inputs/
│   └── SKILL.md
├── new-product/
│   └── SKILL.md
├── test-order-flow/
│   └── SKILL.md
├── deploy-preview/
│   └── SKILL.md
├── db-migrate/
│   └── SKILL.md
├── sync-types/
│   └── SKILL.md
├── check-orders/
│   └── SKILL.md
├── analyze-conversions/
│   └── SKILL.md
├── optimize-images/
│   └── SKILL.md
└── check-accessibility/
    └── SKILL.md
```

---

## Notes

- Skills are project-scoped (committed to git)
- Your team gets these skills automatically
- Skills use restricted tool permissions for safety
- Each skill has detailed documentation
- Skills integrate with existing workflows

---

## Priority Skills to Use First

**Critical for Security:**
1. `/security-audit`
2. `/validate-env`
3. `/sanitize-inputs`

**Critical for Development:**
1. `/new-product` (saves hours)
2. `/test-order-flow` (protects revenue)
3. `/deploy-preview` (prevents issues)

**Nice to Have:**
1. `/check-orders` (business insights)
2. `/optimize-images` (performance)
3. `/analyze-conversions` (growth)

---

## Support

For skill-related issues or enhancements, ask Claude:
- "How do I use the [skill-name] skill?"
- "What does the [skill-name] skill do?"
- "Improve the [skill-name] skill to also do X"

Claude can modify and enhance these skills based on your feedback.

---

**Built with ❤️ for BaaWA Accessories**
