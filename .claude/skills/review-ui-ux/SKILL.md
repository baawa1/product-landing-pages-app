---
name: review-ui-ux
description: Comprehensive UI/UX review of landing pages. Analyzes conversion optimization, accessibility, performance, mobile responsiveness, visual hierarchy, trust signals, form UX, and provides actionable improvements. Use when the user wants to review or improve UI/UX, optimize conversion rates, or get design feedback.
allowed-tools: Read, Edit, Grep, Glob, Bash(npm run dev:*), Bash(lighthouse:*), TodoWrite, AskUserQuestion
---

# UI/UX Review

Comprehensive design and user experience audit for product landing pages. Analyzes conversion optimization, accessibility, performance, and provides prioritized recommendations.

## Instructions

### 1. Determine Scope

Ask the user which page(s) to review:

```typescript
// Default: Review currently opened file
// Or ask: Which product page should I review?
// - All product pages
// - Specific page (megir, gift bundle, executive bundle, etc.)
// - Homepage and thank-you page
```

### 2. Read Target Files

Use Glob and Read to find and analyze the pages:

```bash
# Find all product pages
find app/product -name "page.tsx" -type f

# Read the target page(s)
```

### 3. Critical Issues Audit

Check for conversion-killing problems:

#### 🔴 Critical Issues Checklist

- [ ] **Hardcoded stock status** - Check for static `isOutOfStock` flags
- [ ] **Static urgency messages** - Look for fake scarcity (hardcoded numbers)
- [ ] **Missing hero visuals** - Hero section should have image/video
- [ ] **Broken WhatsApp flow** - Verify redirect logic works
- [ ] **Form validation issues** - Check for proper error handling
- [ ] **Broken image paths** - Verify all image sources exist
- [ ] **Mobile-breaking layouts** - Check responsive breakpoints

**Search patterns:**

```bash
# Find hardcoded stock status
grep -n "isOutOfStock = true" app/product/**/*.tsx

# Find static urgency text
grep -n "remaining\|left in stock" app/product/**/*.tsx

# Check for missing hero images
grep -A 20 "Hero Section" app/product/**/*.tsx
```

### 4. Performance Audit

#### Page Load Performance

```bash
# Start dev server and run Lighthouse
npm run dev &
sleep 5
npx lighthouse http://localhost:3000/product/megir/executive-bundle --only-categories=performance --output=json > lighthouse-performance.json
```

**Check for:**

- [ ] Multiple autoplay videos (heavy on mobile data)
- [ ] Inconsistent image optimization (missing lazy loading)
- [ ] Large page size (1500+ lines might need code splitting)
- [ ] Render-blocking resources
- [ ] Unoptimized images (should use WebP)
- [ ] Missing `loading="lazy"` on below-fold images
- [ ] Missing responsive images (`<picture>` with srcSet)

**Search patterns:**

```bash
# Find autoplay videos
grep -n "autoPlay" app/product/**/*.tsx

# Find images without lazy loading
grep -n "<img" app/product/**/*.tsx | grep -v 'loading='

# Find images without responsive sources
grep -n "<img" app/product/**/*.tsx | grep -v "picture"
```

### 5. Accessibility Audit

#### WCAG 2.1 AA Compliance

- [ ] **Alt text** - All images have descriptive alt attributes
- [ ] **Color contrast** - Text meets 4.5:1 ratio (3:1 for large text)
- [ ] **Keyboard navigation** - All interactive elements focusable
- [ ] **ARIA labels** - Icon buttons and complex widgets labeled
- [ ] **Form accessibility** - Labels, error announcements, required fields
- [ ] **Heading hierarchy** - Logical h1-h6 structure
- [ ] **Focus indicators** - Visible focus states
- [ ] **Screen reader support** - Live regions for dynamic content

**Search patterns:**

```bash
# Find images without alt text
grep -n '<img' app/product/**/*.tsx | grep -v 'alt='

# Find icon buttons without aria-label
grep -n '<button' app/product/**/*.tsx -A 2 | grep -B 2 '<.*Icon' | grep -v 'aria-label'

# Find FAQ accordions without ARIA
grep -n 'onClick.*toggleFaq' app/product/**/*.tsx -A 5 | grep -v 'aria-expanded'

# Check heading hierarchy
grep -n '<h[1-6]' app/product/**/*.tsx
```

### 6. Mobile Responsiveness

Check responsive design implementation:

- [ ] **Touch targets** - Minimum 48px x 48px (Apple: 44px)
- [ ] **Text legibility** - Font size 16px+ on mobile (prevents zoom)
- [ ] **Horizontal scroll** - No overflow on small screens
- [ ] **Spacing** - Adequate padding/margins on mobile
- [ ] **CTA visibility** - Important buttons easy to tap
- [ ] **Form inputs** - Full width on mobile, easy to fill

**Search for responsive classes:**

```bash
# Check for mobile-first breakpoints
grep -n 'md:\|lg:\|sm:' app/product/**/*.tsx | head -20

# Find potentially small touch targets
grep -n 'w-\(8\|10\|11\) h-\(8\|10\|11\)' app/product/**/*.tsx
```

### 7. Visual Hierarchy & Design

#### Layout & Typography

- [ ] **Clear focal point** - Eye naturally drawn to primary CTA
- [ ] **Consistent spacing** - Uses design system (multiples of 4/8)
- [ ] **Typography scale** - Clear hierarchy (h1 > h2 > body)
- [ ] **White space** - Adequate breathing room
- [ ] **Section separation** - Clear visual breaks
- [ ] **Color consistency** - Uses theme colors consistently

#### Information Architecture

- [ ] **Logical content flow** - Problem → Solution → Features → Social Proof → CTA
- [ ] **Progressive disclosure** - Complex info revealed gradually
- [ ] **Scannable content** - Short paragraphs, bullet points, headings
- [ ] **Visual breaks** - Images/videos between text blocks

### 8. Conversion Optimization (CRO)

#### Trust Signals

- [ ] Physical store photos/address
- [ ] Customer testimonials (with photos/initials)
- [ ] Warranty/guarantee information
- [ ] Security badges (payment, warranty)
- [ ] Social proof (customer count, reviews)
- [ ] Return/exchange policy

#### Call-to-Action (CTA) Analysis

- [ ] **Primary CTA** - Stands out with color/size
- [ ] **CTA placement** - Above fold + repeated throughout
- [ ] **Action-oriented copy** - "Claim Your Bundle" not "Submit"
- [ ] **Urgency** - Limited time/stock (if genuine)
- [ ] **Value reinforcement** - Price + savings visible near CTA
- [ ] **Floating CTA** - Sticky button when scrolling

**Search patterns:**

```bash
# Find CTAs
grep -n '<Button' app/product/**/*.tsx -A 2

# Check for floating/sticky CTA
grep -n 'fixed\|sticky' app/product/**/*.tsx

# Find testimonials
grep -n 'testimonial' app/product/**/*.tsx -i
```

#### Price & Value Communication

- [ ] Bundle value breakdown shown
- [ ] Savings calculation clear
- [ ] Price anchoring (crossed-out prices)
- [ ] Quantity discounts explained
- [ ] No hidden costs (delivery calculated after)

### 9. Form UX Analysis

#### Order Form Best Practices

- [ ] **Minimal fields** - Only ask for essential info
- [ ] **Visual hierarchy** - Labels, inputs, helpers clearly separated
- [ ] **Input types** - Correct type (tel, email, text)
- [ ] **Validation** - Real-time feedback on errors
- [ ] **Error messages** - Specific, helpful (not "Invalid input")
- [ ] **Submit button state** - Loading indicator during submit
- [ ] **Mobile optimization** - Large inputs, easy to tap
- [ ] **Autofocus** - First field focused (if form is primary purpose)
- [ ] **Autocomplete** - Helps users fill faster
- [ ] **Progress indicator** - Shows completion (for multi-step)

**Search patterns:**

```bash
# Find form inputs
grep -n '<input\|<select\|<textarea' app/product/**/*.tsx

# Check for validation
grep -n 'required\|pattern\|aria-invalid' app/product/**/*.tsx

# Check for loading states
grep -n 'isSubmitting\|loading' app/product/**/*.tsx
```

### 10. Content & Copy Analysis

#### Persuasive Copy Checklist

- [ ] **Headline** - Clear benefit, not just product name
- [ ] **Problem agitation** - Identifies customer pain points
- [ ] **Solution framing** - Shows how product solves problem
- [ ] **Specific benefits** - Not vague ("premium quality" ❌, "2-year warranty" ✅)
- [ ] **Social proof** - Real testimonials with details
- [ ] **FAQs** - Address common objections
- [ ] **Scarcity/urgency** - Real, not fabricated
- [ ] **Guarantee** - Risk reversal (warranty, returns)

### 11. Technical SEO & Metadata

```bash
# Check for layout.tsx with metadata
find app/product -name "layout.tsx"

# Read metadata configuration
```

- [ ] **Page title** - Descriptive, includes keywords
- [ ] **Meta description** - Compelling, 150-160 chars
- [ ] **OG images** - Social sharing images set
- [ ] **Canonical URL** - Prevents duplicate content
- [ ] **Structured data** - Product schema markup

### 12. Generate Comprehensive Report

Create a detailed markdown report with prioritized findings:

```markdown
# UI/UX Review Report: [Product Page Name]

**Review Date:** [Date]
**Page:** [File path]
**Review Score:** [X/100]

---

## Executive Summary

[2-3 sentence overview of page quality and key findings]

**Overall Score Breakdown:**
- Critical Issues: [X found]
- Performance: [X/100]
- Accessibility: [X/100]
- Mobile UX: [X/100]
- Conversion Optimization: [X/100]

---

## 🔴 Critical Issues (Fix Immediately)

### 1. [Issue Title]
**Impact:** High | **Effort:** Low
**Location:** [file.tsx:line]

**Problem:**
[Describe the issue and why it's critical]

**Fix:**
```tsx
// Before
[current code]

// After
[fixed code]
```

---

## ⚠️ Performance Issues

### Page Load Metrics
- **Page Size:** [X KB]
- **Images:** [X total, Y unoptimized]
- **Videos:** [X autoplaying]
- **Lighthouse Score:** [X/100]

### Issues Found:
1. **Multiple autoplay videos** ([file:line])
   - Impact: Heavy mobile data usage, slower page load
   - Fix: Lazy load videos, use poster images

---

## ♿ Accessibility Issues (WCAG 2.1 AA)

### Critical:
1. **Missing alt text on images** (X instances)
   - [file.tsx:line]
   - Fix: Add descriptive alt attributes

### Moderate:
1. **FAQ accordion lacks ARIA** ([file:line])
   - Fix: Add aria-expanded, aria-controls

---

## 📱 Mobile Responsiveness

### Issues:
1. **Touch targets too small** ([file:line])
   - Current: 40px x 40px
   - Required: 48px x 48px minimum
   - Fix: Increase button size to `w-12 h-12`

---

## 💰 Conversion Optimization

### Trust Signals: [X/6]
- [✅] Physical store photos
- [❌] Customer testimonials (need photos)
- [✅] Warranty information

### CTA Analysis:
**Strengths:**
- Clear value proposition
- Multiple CTAs throughout page
- Floating CTA on scroll

**Improvements:**
1. Make primary CTA more prominent (increase size)
2. Add urgency to bottom CTA
3. Test button copy variations

---

## 📋 Recommendations by Priority

### High Priority (Do First)
1. Fix hardcoded stock status
2. Add lazy loading to images
3. Fix accessibility issues (alt text, ARIA)
4. Increase mobile touch targets

### Medium Priority (Do Next)
1. Optimize image formats (convert to WebP)
2. Add form validation feedback
3. Improve FAQ accessibility
4. Add more testimonials with photos

### Low Priority (Nice to Have)
1. Add skip-to-content link
2. Implement dark mode
3. Add product schema markup
4. Create video thumbnails for lazy loading

---

## 📊 Scoring Details

### Performance: [X/100]
- Page load speed: [X/25]
- Image optimization: [X/25]
- Code efficiency: [X/25]
- Resource loading: [X/25]

### Accessibility: [X/100]
- WCAG compliance: [X/40]
- Keyboard navigation: [X/20]
- Screen reader support: [X/20]
- Color contrast: [X/20]

### Mobile UX: [X/100]
- Touch targets: [X/25]
- Text legibility: [X/25]
- Responsive layout: [X/25]
- Mobile performance: [X/25]

### Conversion Optimization: [X/100]
- Trust signals: [X/20]
- CTA effectiveness: [X/20]
- Content clarity: [X/20]
- Form UX: [X/20]
- Social proof: [X/20]

---

## ✅ Positive Highlights

1. **Excellent conversion structure** - Clear problem-solution flow
2. **Strong trust signals** - Physical store, warranty, testimonials
3. **Good responsive design** - Mobile-first approach
4. **Smart floating CTA** - Appears when needed
5. [Other strengths found]

---

## 🎯 Next Steps

1. [ ] Fix critical issues (hardcoded values, accessibility)
2. [ ] Optimize images and videos
3. [ ] Implement recommended UX improvements
4. [ ] Run Lighthouse audit to verify improvements
5. [ ] A/B test CTA variations

---

## Testing Recommendations

**Before deployment:**
- [ ] Test on real mobile devices (iOS + Android)
- [ ] Run Lighthouse performance audit
- [ ] Test keyboard navigation
- [ ] Verify WhatsApp flow works
- [ ] Check all image paths load correctly
- [ ] Test form validation and submission
- [ ] Review on slow 3G connection

**Tools to use:**
- Lighthouse (performance + accessibility)
- WAVE (accessibility evaluation)
- Google Mobile-Friendly Test
- PageSpeed Insights
- BrowserStack (cross-browser testing)

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conversion Optimization Checklist](https://cxl.com/blog/conversion-optimization-checklist/)
- [Mobile UX Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/principles)
- [Web Performance Best Practices](https://web.dev/performance/)

---

**Report generated by Claude Code UI/UX Review Skill**
```

### 13. Create Interactive Fixes

For each issue found, offer to fix it:

```typescript
// Use AskUserQuestion to prioritize fixes
"I found [X] issues. Would you like me to:"
1. "Fix all critical issues now (Recommended)"
2. "Fix critical + performance issues"
3. "Show me detailed report first"
4. "Fix specific issues (I'll ask which)"
```

### 14. Implementation

After user approval, make the fixes:

```bash
# Example: Fix lazy loading on images
# Find all images below fold
# Add loading="lazy" attribute

# Example: Fix accessibility
# Add alt text to images
# Add ARIA labels to buttons
# Fix FAQ accordion ARIA
```

## Common Issues & Fixes

### Issue: Static Urgency Messages

```tsx
// ❌ Bad - Hardcoded, loses trust
<div>⚡ <strong>47 Executive Bundles</strong> remaining</div>

// ✅ Good - Dynamic or removed
{stockCount > 0 && (
  <div>⚡ <strong>{stockCount} Executive Bundles</strong> remaining</div>
)}

// ✅ Better - Time-based urgency (real)
<div>🔥 Limited Time Offer - Ends {endDate}</div>
```

### Issue: Missing Hero Visual

```tsx
// ❌ Bad - Text only hero
<section className="hero">
  <h1>Stop Wearing Watches That Embarrass You</h1>
  <p>Description...</p>
</section>

// ✅ Good - With visual
<section className="hero grid md:grid-cols-2">
  <div>
    <h1>Stop Wearing Watches That Embarrass You</h1>
    <p>Description...</p>
  </div>
  <div>
    <img src="/hero-watch.webp" alt="MEGIR Executive Watch" />
  </div>
</section>
```

### Issue: Autoplay Videos

```tsx
// ⚠️ Heavy - Autoplays immediately
<video autoPlay muted loop playsInline>
  <source src="/product-video.mp4" />
</video>

// ✅ Better - Lazy loaded with poster
<video
  poster="/video-thumbnail.jpg"
  controls
  preload="none"
  loading="lazy"
>
  <source src="/product-video.mp4" />
</video>

// ✅ Best - Intersection Observer for autoplay
const [shouldPlay, setShouldPlay] = useState(false)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setShouldPlay(entry.isIntersecting),
    { threshold: 0.5 }
  )
  if (videoRef.current) observer.observe(videoRef.current)
  return () => observer.disconnect()
}, [])

<video
  ref={videoRef}
  autoPlay={shouldPlay}
  muted
  loop
  playsInline
  poster="/thumbnail.jpg"
/>
```

### Issue: Poor Touch Targets

```tsx
// ❌ Bad - Too small (40px)
<button className="w-10 h-10">−</button>

// ✅ Good - Meets minimum (48px)
<button className="w-12 h-12">−</button>

// ✅ Better - Extra comfortable
<button className="w-14 h-14 md:w-12 md:h-12">−</button>
```

### Issue: Missing Image Optimization

```tsx
// ❌ Bad - No optimization
<img src="/product.jpg" alt="Product" />

// ✅ Good - Lazy loading + WebP
<img
  src="/product.webp"
  alt="MEGIR Executive Watch"
  loading="lazy"
  width={600}
  height={600}
/>

// ✅ Best - Responsive images
<picture>
  <source
    srcSet="/product-mobile.webp"
    media="(max-width: 640px)"
    type="image/webp"
  />
  <source
    srcSet="/product-tablet.webp"
    media="(max-width: 1024px)"
    type="image/webp"
  />
  <source
    srcSet="/product-desktop.webp"
    type="image/webp"
  />
  <img
    src="/product-desktop.webp"
    alt="MEGIR Executive Watch on professional wrist"
    loading="lazy"
    className="w-full h-auto"
  />
</picture>
```

### Issue: FAQ Without ARIA

```tsx
// ❌ Bad - No accessibility
<button onClick={() => toggleFaq(index)}>
  <span>{item.question}</span>
  <ChevronDown className={activeFaq === index ? "rotate-180" : ""} />
</button>
{activeFaq === index && <div>{item.answer}</div>}

// ✅ Good - Accessible
<button
  onClick={() => toggleFaq(index)}
  aria-expanded={activeFaq === index}
  aria-controls={`faq-answer-${index}`}
  id={`faq-question-${index}`}
>
  <span>{item.question}</span>
  <ChevronDown
    className={activeFaq === index ? "rotate-180" : ""}
    aria-hidden="true"
  />
</button>
<div
  id={`faq-answer-${index}`}
  role="region"
  aria-labelledby={`faq-question-${index}`}
  hidden={activeFaq !== index}
>
  {item.answer}
</div>
```

### Issue: No Form Validation Feedback

```tsx
// ❌ Bad - No feedback
<input
  type="tel"
  name="phone"
  required
/>

// ✅ Good - Real-time validation
const [phoneError, setPhoneError] = useState("")

const validatePhone = (phone: string) => {
  if (!phone) return "Phone number is required"
  if (!/^[0-9]{10,11}$/.test(phone)) {
    return "Enter valid 10-11 digit phone number"
  }
  return ""
}

<div>
  <label htmlFor="phone">WhatsApp Number *</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    required
    aria-invalid={phoneError ? "true" : "false"}
    aria-describedby={phoneError ? "phone-error" : undefined}
    onBlur={(e) => setPhoneError(validatePhone(e.target.value))}
    className={phoneError ? "border-red-500" : ""}
  />
  {phoneError && (
    <div
      id="phone-error"
      role="alert"
      className="text-red-500 text-sm mt-1"
    >
      {phoneError}
    </div>
  )}
</div>
```

## Scoring System

**Overall Score Formula:**
```
Overall Score = (
  Performance Score × 0.25 +
  Accessibility Score × 0.25 +
  Mobile UX Score × 0.25 +
  Conversion Score × 0.25
)
```

**Grade Scale:**
- 90-100: Excellent (A)
- 80-89: Good (B)
- 70-79: Needs Improvement (C)
- 60-69: Poor (D)
- Below 60: Critical Issues (F)

**Deductions:**
- Critical issue: -10 points each
- Performance issue: -5 points each
- Accessibility issue: -3 points each
- UX issue: -2 points each

## Testing Checklist

After making fixes, verify improvements:

- [ ] Run Lighthouse audit (target: 90+ performance, 95+ accessibility)
- [ ] Test on mobile device (iOS + Android)
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test form validation
- [ ] Verify WhatsApp flow
- [ ] Check all images load
- [ ] Test on slow 3G connection
- [ ] Verify all CTAs work
- [ ] Check cross-browser compatibility

## Pro Tips

1. **Always prioritize mobile** - 70%+ traffic is mobile
2. **Test on real devices** - Emulators miss touch/scroll issues
3. **Focus on conversion** - Beautiful ≠ Effective
4. **Use real data** - Don't fake urgency/scarcity
5. **Accessibility = SEO** - Screen readers and Google bots both need semantic HTML
6. **Performance = Conversion** - 1 second delay = 7% conversion loss
7. **Trust > Design** - Users need to trust you before they buy
8. **Simplify forms** - Every field reduces conversion ~5%

## Notes

- Focus on high-impact, low-effort fixes first
- Balance aesthetics with conversion optimization
- Always test changes before deployment
- Consider A/B testing major changes
- Review pages quarterly (user behavior changes)
- Get feedback from real users when possible
