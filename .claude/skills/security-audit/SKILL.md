---
name: security-audit
description: Comprehensive security audit of the Next.js landing page app. Scans for XSS vulnerabilities, SQL injection risks, missing input validation, exposed secrets, rate limiting issues, CORS misconfigurations, CSRF protection, and weak Content Security Policy headers. Use when the user asks about security, vulnerabilities, or before deploying to production.
allowed-tools: Read, Grep, Glob, Bash(npm run lint:*), TodoWrite
---

# Security Audit

Performs a comprehensive security check of the BaaWA landing page application, identifying vulnerabilities and providing actionable fixes.

## Instructions

### 1. Initialize Audit Checklist

Create a todo list with these security checks:
- XSS vulnerability scan in product pages
- Input validation check in API routes
- Secret exposure scan
- Rate limiting verification
- CORS configuration review
- CSRF protection check
- Environment variable validation
- Dependencies vulnerability scan

### 2. XSS Vulnerability Scan

**Check for dangerous patterns:**
- Search for `dangerouslySetInnerHTML` usage
- Look for unescaped user input in JSX
- Check metadata field handling in order forms
- Verify all form inputs are properly sanitized

**Files to check:**
- `app/product/megir/**/*.tsx` - All product pages
- `app/api/orders/route.ts` - Order processing
- `components/ui/*.tsx` - UI components

**Red flags:**
- Direct DOM manipulation without sanitization
- User input rendered without escaping
- innerHTML usage with dynamic content

### 3. API Route Security Review

**Check `/app/api/orders/route.ts` for:**
- Missing rate limiting (CRITICAL - currently vulnerable)
- Input validation completeness
- SQL injection prevention (verify Supabase usage is safe)
- Error message exposure (don't leak sensitive info)
- Missing authentication/authorization
- CORS headers configuration

**Specific checks:**
```typescript
// MUST validate:
- Phone number format (Nigerian: +234...)
- Email format (if provided)
- Price/quantity are positive numbers
- Metadata JSON structure (prevent injection)
- State is valid Nigerian state
- Address length limits
```

### 4. Secret Exposure Scan

**Search for exposed secrets:**
```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" app/
grep -r "sk_" .
grep -r "pk_" .
grep -r "password" .
grep -r "secret" .
```

**Check:**
- `.env.local` is in `.gitignore`
- No API keys in client-side code
- `lib/supabase.ts` only uses service key server-side
- No hardcoded credentials anywhere

### 5. Dependency Vulnerability Scan

Run npm audit:
```bash
npm audit --production
```

**Report:**
- Critical and high vulnerabilities
- Outdated packages with known exploits
- Recommended updates

### 6. CORS and Headers Check

**Verify in `next.config.ts` or middleware:**
- CORS allows only your domain
- Content-Security-Policy headers set
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy configured

**If missing, note that headers should be added.**

### 7. Rate Limiting Check

**CRITICAL: Currently missing from `/api/orders`**

Check if implemented:
- Request throttling per IP
- Brute force protection
- DoS prevention

**If missing (it is), recommend:**
```typescript
// Add rate limiting with next-rate-limit or similar
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const identifier = request.ip ?? '127.0.0.1'
  const { success } = await rateLimit(identifier)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ... rest of handler
}
```

### 8. Environment Variable Security

**Check:**
- All required env vars documented in `.env.example`
- No placeholder values in production
- Sensitive vars prefixed correctly (NEXT_PUBLIC_ only for client-safe)
- `SUPABASE_SERVICE_ROLE_KEY` never exposed to client

### 9. Form Input Validation

**Check all product pages for:**
- Client-side validation (basic UX)
- Server-side validation (security critical)
- Sanitization before database insert
- Maximum length limits on text fields
- Type coercion security (parseInt, parseFloat usage)

### 10. Generate Security Report

**Create a markdown report with:**

```markdown
# Security Audit Report - [DATE]

## ✅ Passing Checks
- List items that passed

## ⚠️ Warnings
- List medium-priority issues

## 🚨 Critical Issues
- List high-priority vulnerabilities

## Recommendations
1. Immediate actions (critical fixes)
2. Short-term improvements (warnings)
3. Long-term hardening (best practices)

## Next Steps
- Prioritized action items with code examples
```

## Security Severity Levels

**🚨 CRITICAL (Fix immediately):**
- No rate limiting on API endpoints
- SQL injection vulnerabilities
- Exposed service role keys
- XSS in user-facing pages

**⚠️ HIGH (Fix before next deployment):**
- Missing input validation
- Weak CORS configuration
- Missing security headers
- Outdated dependencies with known exploits

**⚡ MEDIUM (Plan to fix):**
- Missing CSRF tokens
- Incomplete error handling
- Logging sensitive data
- Missing Content Security Policy

**ℹ️ LOW (Best practice):**
- Outdated dependencies (no known exploits)
- Missing security headers (defense in depth)
- Verbose error messages

## Example Output

```
🔒 Security Audit Complete

✅ Passing Checks (5/10):
  - No secrets in client code
  - Supabase RLS properly configured
  - Environment variables correctly prefixed
  - SQL injection protected (Supabase ORM)
  - Dependencies mostly up-to-date

🚨 CRITICAL Issues (2):
  1. Missing rate limiting on /api/orders
     - File: app/api/orders/route.ts:4
     - Risk: Spam attacks, database overload
     - Fix: Implement rate limiting (see recommendation)

  2. Unvalidated metadata field accepts any JSON
     - File: app/api/orders/route.ts:42
     - Risk: JSON injection, XSS via stored data
     - Fix: Add schema validation for metadata

⚠️ HIGH Issues (3):
  1. Missing phone number format validation
  2. No Content-Security-Policy headers
  3. Error messages may leak info

Full report generated at: security-report.md
```

## Common Fixes

**Add rate limiting:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Add input sanitization:**
```bash
npm install validator
npm install --save-dev @types/validator
```

**Add Zod schema validation:**
```bash
npm install zod
```

## Notes

- Run this before every production deployment
- Update the security checklist as new features are added
- Keep track of fixes in TodoWrite
- Re-run after applying fixes to verify
- Consider integrating into CI/CD pipeline
