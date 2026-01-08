# Quick Start Guide - BaaWA Skills

Get started with your new custom skills in 5 minutes.

## 🚀 First-Time Setup

### Step 1: Verify Installation

All skills are already installed! Check them:

```bash
ls .claude/skills/
```

You should see:
- security-audit
- validate-env
- sanitize-inputs
- new-product
- test-order-flow
- deploy-preview
- db-migrate
- sync-types
- check-orders
- analyze-conversions
- optimize-images
- check-accessibility

### Step 2: Run Your First Skill

Just ask Claude naturally. For example:

**Check your environment:**
```
You: "Validate my environment variables"
```

Claude will automatically use the `/validate-env` skill.

### Step 3: Run Security Audit (Recommended)

```
You: "Run a security audit"
```

This will identify any immediate security issues that need attention.

---

## 🎯 Essential First Tasks

Do these right now to improve your app:

### 1. Security Check (5 minutes)
```
You: "Run a security audit on my app"
```

This will find:
- Missing rate limiting
- Exposed secrets
- XSS vulnerabilities
- Outdated dependencies

### 2. Environment Validation (2 minutes)
```
You: "Check if my environment variables are correct"
```

Ensures your Supabase keys are configured properly.

### 3. Test Order Flow (3 minutes)
```
You: "Test the order flow to make sure it works"
```

Verifies orders are being saved to the database.

---

## 💡 Common Use Cases

### Adding a New Product

```
You: "Create a new product page for Premium Leather Wallet"
```

Claude will:
1. Ask you for product details (price, colors, etc.)
2. Generate page.tsx and layout.tsx
3. Set up image directories
4. Give you next steps

### Checking Today's Sales

```
You: "Show me today's orders"
```

Or directly:
```bash
npm run orders:today
```

### Before Deployment

```
You: "I want to deploy to production, run all pre-deployment checks"
```

Claude will:
1. Run security audit
2. Validate environment
3. Build and test
4. Check bundle size
5. Generate deployment report

### Optimizing Performance

```
You: "My page is loading slowly, what can I do?"
```

Claude will suggest running:
- `/optimize-images` - Compress product images
- `/analyze-conversions` - Check page performance
- `/check-accessibility` - Ensure best practices

---

## 📋 Daily Developer Workflow

### Morning Routine
```bash
# Check overnight orders
npm run orders:today

# Or ask Claude:
"Show me orders from yesterday"
```

### After Making Changes
```
You: "Test the order flow to make sure I didn't break anything"
```

### Before Pushing Code
```
You: "Run lint and build, fix any errors"
```

(Uses your existing `/lint-build-push` skill)

---

## 🔄 Weekly Maintenance

Every Friday (or before weekend):

```
You: "Run a full security audit and generate a report"
```

```
You: "Show me the week's orders and revenue summary"
```

```
You: "Check if my images need optimization"
```

---

## 🆘 Troubleshooting

### Orders Not Saving?
```
You: "My orders aren't being saved, help me debug"
```

Claude will:
1. Check environment variables
2. Test Supabase connection
3. Run test order
4. Identify the issue

### Site Loading Slow?
```
You: "My site is slow, help me optimize"
```

Claude will:
1. Run Lighthouse audit
2. Check image sizes
3. Analyze bundle size
4. Suggest optimizations

### Form Validation Errors?
```
You: "Add proper validation to my order form"
```

Uses `/sanitize-inputs` to add:
- Zod schemas
- Nigerian phone validation
- XSS prevention
- Rate limiting

---

## 🎓 Advanced Usage

### Database Changes

**Adding a column:**
```
You: "Add a tracking_number field to the orders table"
```

Claude will:
1. Generate migration SQL
2. Test locally (optional)
3. Apply to production
4. Update TypeScript types
5. Show you how to use the new field

### Creating Product Variants

```
You: "Create a Valentine's Day special variant of the MEGIR Gift Bundle"
```

Claude will use `/new-product` to scaffold the variant page.

### Conversion Optimization

```
You: "Analyze my conversion funnel and suggest improvements"
```

Claude will:
1. Check GTM events
2. Analyze drop-off points
3. Review page performance
4. Recommend specific changes

---

## 📚 Skill Cheat Sheet

| Task | What to Say |
|------|-------------|
| Security check | "Run security audit" |
| Check orders | "Show today's orders" |
| New product | "Create product page for X" |
| Test orders | "Test order flow" |
| Deploy ready | "Am I ready to deploy?" |
| Fix validation | "Add input validation" |
| Database change | "Add X field to orders" |
| Optimize images | "Optimize product images" |
| Check a11y | "Run accessibility audit" |
| Sync database | "Sync types with Supabase" |

---

## 🔧 Manual Commands

Some skills also add npm scripts:

```bash
# Order dashboard
npm run orders              # Last 7 days
npm run orders:today        # Today only
npm run orders:week         # Last 7 days
npm run orders:month        # Last 30 days

# Image optimization
npm run images:optimize     # Optimize all images
npm run images:analyze      # Show image sizes
npm run images:large        # Find images >500KB

# Type sync
npm run types:sync          # Sync TS types from Supabase

# Accessibility
npm run a11y                # Run Pa11y tests

# Testing
npm run test:orders         # Test order flow
```

---

## 🎯 Your First 30 Minutes

Follow this checklist to secure and optimize your app:

**Minute 1-5: Security**
- [ ] Run security audit
- [ ] Note critical issues
- [ ] Ask Claude to fix them

**Minute 6-10: Environment**
- [ ] Validate environment variables
- [ ] Ensure no placeholder values
- [ ] Verify Supabase connection

**Minute 11-15: Testing**
- [ ] Test order flow
- [ ] Submit a test order
- [ ] Verify it appears in Supabase

**Minute 16-20: Performance**
- [ ] Check image sizes
- [ ] Optimize if needed
- [ ] Run Lighthouse audit

**Minute 21-25: Analytics**
- [ ] Check recent orders
- [ ] Review conversion data
- [ ] Set up GTM events (if missing)

**Minute 26-30: Deployment**
- [ ] Run deploy preview
- [ ] Review checklist
- [ ] Deploy if all green

---

## 💬 Natural Language Examples

You don't need to remember exact commands. Just talk naturally:

**✅ These all work:**
- "Check my security"
- "Run a security scan"
- "Are there any security issues?"
- "Audit my app for vulnerabilities"

**✅ These all work:**
- "Show me orders"
- "What sales did I make today?"
- "Check recent purchases"
- "How much revenue this week?"

**✅ These all work:**
- "Make the images smaller"
- "Optimize my images"
- "Why are my images so large?"
- "Speed up page loading"

Claude understands intent and will use the right skill!

---

## 🚨 When Skills Auto-Run

Some skills run automatically when you mention certain things:

**Security-related words:**
- "security", "vulnerability", "safe", "exploit"
- → Triggers `/security-audit`

**Order-related requests:**
- "orders", "sales", "revenue", "customers"
- → Triggers `/check-orders`

**New product requests:**
- "new product", "add product", "create page"
- → Triggers `/new-product`

**Deployment preparation:**
- "deploy", "production", "go live", "release"
- → Triggers `/deploy-preview`

---

## ✨ Pro Tips

1. **Be specific:** "Add validation to the gift bundle form" is better than "add validation"

2. **Chain requests:** "Run security audit, then optimize images, then prepare for deployment"

3. **Ask for explanations:** "Why did the security audit fail?" or "Explain what this skill does"

4. **Customize skills:** "Make the check-orders skill also show customer locations"

5. **Create new skills:** "Create a skill that backs up the database daily"

---

## 📞 Need Help?

Just ask Claude:
- "How do I use the security-audit skill?"
- "What skills do I have available?"
- "Show me examples of using the new-product skill"
- "Can you explain what the sanitize-inputs skill does?"

---

**Ready to Go?**

Start with:
```
You: "Run a security audit on my app"
```

Let's make your app secure, fast, and production-ready! 🚀
