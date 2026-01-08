---
name: validate-env
description: Validates environment variables for the Next.js app. Checks that all required Supabase keys and configuration are set, no placeholder values exist in production, sensitive keys are not committed to git, and .env.example is up-to-date. Use when deploying, debugging env issues, or when the user mentions environment variables or configuration.
allowed-tools: Read, Bash(cat:*), Bash(printenv:*), Grep, TodoWrite
---

# Environment Variable Validator

Ensures your environment configuration is secure, complete, and production-ready.

## Instructions

### 1. Read Current Environment Files

Read and analyze:
- `.env.local` - Local development environment
- `.env.example` - Template for team members
- `lib/supabase.ts` - Check default fallback values
- `.gitignore` - Verify env files are excluded

### 2. Check Required Variables

**Verify these exist and are not empty:**

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL
```

**Check format:**
- `NEXT_PUBLIC_SUPABASE_URL` matches pattern: `https://[project-id].supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a long JWT-like string (starts with `eyJ`)
- `SUPABASE_SERVICE_ROLE_KEY` is a long JWT-like string (starts with `eyJ`)
- `NEXT_PUBLIC_BASE_URL` is a valid URL (http://localhost:3000 or production domain)

### 3. Check for Placeholder Values

**CRITICAL: Detect placeholder values that would cause silent failures:**

From `lib/supabase.ts:3-5`, these are the dangerous defaults:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
```

**Check if any of these values are being used:**
- `https://placeholder.supabase.co`
- `placeholder-key`
- `placeholder-service-key`

**If found, this is a CRITICAL issue - the app will silently fail to save orders.**

### 4. Verify .gitignore Protection

**Check that `.gitignore` contains:**
```
.env
.env.local
.env.*.local
```

**Verify no env files are tracked in git:**
```bash
git ls-files | grep "\.env"
```

If any `.env` files appear (except `.env.example`), they're being tracked - CRITICAL SECURITY ISSUE.

### 5. Check .env.example Completeness

**Compare `.env.example` with actual `.env.local`:**

`.env.example` should have all the same keys as `.env.local`, but with placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Report any missing keys in `.env.example`.**

### 6. Check Variable Prefix Security

**Verify security boundaries:**

**✅ CORRECT - Public variables (safe for browser):**
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓ (anon key is designed to be public)
- `NEXT_PUBLIC_BASE_URL` ✓

**✅ CORRECT - Server-only variables (never exposed to browser):**
- `SUPABASE_SERVICE_ROLE_KEY` ✓ (NO NEXT_PUBLIC_ prefix)

**🚨 CRITICAL if found:**
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` ❌ Would expose admin key to browser!

### 7. Check for Hardcoded Secrets

**Search codebase for hardcoded secrets:**

```bash
# Check for hardcoded URLs (should use env var)
grep -r "https://[a-z0-9]*\.supabase\.co" app/ lib/ --exclude-dir=node_modules

# Check for hardcoded keys (huge security risk)
grep -r "eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*" app/ lib/ --exclude-dir=node_modules
```

**If any hardcoded secrets found, this is CRITICAL.**

### 8. Validate Production Environment

**If checking for production deployment:**

Ask the user:
```
Are you deploying to production? If yes:
1. Verify NEXT_PUBLIC_BASE_URL is set to your production domain
2. Confirm all Supabase keys are from production project
3. Check that you're not using development/staging keys
```

**Production checklist:**
- ❌ localhost URLs
- ❌ Development Supabase project keys
- ✅ Production domain in BASE_URL
- ✅ Production Supabase project keys
- ✅ All keys are unique (not copied from example)

### 9. Test Environment Loading

**Verify Next.js can access the variables:**

Create a simple test:
```typescript
// Quick check that env vars are loaded
console.log('Env check:', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL
})
```

### 10. Generate Validation Report

**Create a clear status report:**

```markdown
# Environment Validation Report

## ✅ Passing Checks
- List all passing validations

## ⚠️ Warnings
- List non-critical issues

## 🚨 Critical Issues
- List blocking issues

## Action Items
1. Immediate fixes required
2. Recommended improvements
```

## Example Output

```
🔐 Environment Validation Complete

✅ Passing Checks:
  - All required variables are set
  - .env.local is in .gitignore
  - No env files tracked in git
  - Variable prefixes are correct
  - No hardcoded secrets found

⚠️ Warnings (1):
  - .env.example is missing NEXT_PUBLIC_BASE_URL
    Fix: Add this line to .env.example:
    NEXT_PUBLIC_BASE_URL=http://localhost:3000

🚨 CRITICAL Issues (0):
  - None found!

Environment is production-ready ✓
```

## Common Issues and Fixes

### Issue: Placeholder values detected
```
🚨 CRITICAL: Using placeholder values from lib/supabase.ts

Your .env.local is missing actual Supabase credentials.
The app will appear to work but orders won't be saved!

Fix:
1. Go to https://supabase.com/dashboard
2. Copy your project URL and keys
3. Update .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
```

### Issue: .env.local tracked in git
```
🚨 CRITICAL: .env.local is tracked in git!

This exposes your secrets in git history.

Fix:
1. Remove from git: git rm --cached .env.local
2. Add to .gitignore (if not already there)
3. Commit the removal
4. Rotate all exposed keys immediately
```

### Issue: Wrong variable prefix
```
🚨 CRITICAL: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY found!

Never prefix service role key with NEXT_PUBLIC_ - this exposes
your admin key to the browser, allowing anyone to bypass security.

Fix:
1. Rename to SUPABASE_SERVICE_ROLE_KEY in .env.local
2. Update lib/supabase.ts if needed (already correct)
3. Rotate the exposed key immediately
```

### Issue: Missing .env.local
```
⚠️ WARNING: .env.local not found

Create .env.local with:

cp .env.example .env.local

Then fill in your actual values from Supabase dashboard.
```

## Quick Fix Guide

**To create a proper .env.local:**

```bash
# Create from example
cp .env.example .env.local

# Edit with your values
# Use your text editor to replace placeholders with real values
```

**To update .env.example:**

```bash
# Add any missing variables (without real values)
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.example
```

**To verify .gitignore:**

```bash
# Check if .env.local is ignored
git check-ignore .env.local

# Should output: .env.local
# If nothing outputs, add to .gitignore
```

## Notes

- Run this before every deployment
- Run this when setting up a new environment
- Run this if orders aren't being saved (likely env issue)
- Keep .env.example updated for team members
- Never commit actual secrets to git
