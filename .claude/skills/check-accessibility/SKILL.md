---
name: check-accessibility
description: Comprehensive accessibility audit. Scans for missing alt text, poor color contrast, missing ARIA labels, keyboard navigation issues, and screen reader compatibility. Ensures WCAG 2.1 AA compliance. Use when improving accessibility, before deployment, or when the user mentions accessibility or a11y.
allowed-tools: Read, Edit, Grep, Bash(npm run dev:*), Bash(npx:*), Bash(lighthouse:*), TodoWrite
---

# Accessibility Audit (A11y)

Ensure your landing pages are accessible to all users, including those with disabilities.

## Instructions

### 1. Install Accessibility Tools

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/cli

# Install Pa11y for accessibility testing
npm install --save-dev pa11y pa11y-ci
```

### 2. Check for Missing Alt Text

Find all images without alt attributes:

```bash
# Find img tags
grep -r "<img" app/product --include="*.tsx" -n

# Check for missing alt
grep -r '<img[^>]*>' app/product --include="*.tsx" | grep -v 'alt='
```

**Review each image and add descriptive alt text:**

```tsx
// ❌ Bad
<img src="/products/megir/1.jpg" />

// ⚠️ Not helpful
<img src="/products/megir/1.jpg" alt="image" />

// ✅ Good
<img src="/products/megir/1.jpg" alt="MEGIR Chronograph Watch in Navy Blue with leather strap" />

// ✅ Decorative images
<img src="/decorative-line.png" alt="" role="presentation" />
```

### 3. Check Color Contrast

**Test contrast ratios:**

Create `scripts/check-contrast.js`:

```javascript
/**
 * Color Contrast Checker
 *
 * WCAG 2.1 AA Requirements:
 * - Normal text: 4.5:1 minimum
 * - Large text (18pt+): 3:1 minimum
 * - UI components: 3:1 minimum
 */

const checks = [
  {
    name: 'Primary button',
    background: '#1B3A5F', // Navy blue
    foreground: '#FFFFFF', // White text
    size: 'normal'
  },
  {
    name: 'Secondary text',
    background: '#FFFFFF',
    foreground: '#6B7280', // Gray text
    size: 'normal'
  },
  {
    name: 'Price text',
    background: '#FFFFFF',
    foreground: '#000000',
    size: 'large'
  },
  {
    name: 'Discount badge',
    background: '#EF4444', // Red
    foreground: '#FFFFFF',
    size: 'normal'
  }
]

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function luminance(rgb) {
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function contrastRatio(color1, color2) {
  const lum1 = luminance(hexToRgb(color1))
  const lum2 = luminance(hexToRgb(color2))
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function checkContrast(bg, fg, size) {
  const ratio = contrastRatio(bg, fg)
  const minRatio = size === 'large' ? 3.0 : 4.5
  const passes = ratio >= minRatio
  return { ratio: ratio.toFixed(2), passes, minRatio }
}

console.log('\n🎨 Color Contrast Audit\n')
console.log('WCAG 2.1 AA Standards:')
console.log('- Normal text: 4.5:1 minimum')
console.log('- Large text (18pt+): 3:1 minimum\n')
console.log('━'.repeat(60))

checks.forEach(check => {
  const result = checkContrast(check.background, check.foreground, check.size)
  const icon = result.passes ? '✅' : '❌'

  console.log(`\n${icon} ${check.name}`)
  console.log(`   Background: ${check.background}`)
  console.log(`   Foreground: ${check.foreground}`)
  console.log(`   Ratio: ${result.ratio}:1 (requires ${result.minRatio}:1)`)
  console.log(`   Status: ${result.passes ? 'PASS' : 'FAIL'}`)

  if (!result.passes) {
    console.log(`   ⚠️  Action: Adjust colors to meet minimum contrast`)
  }
})

console.log('\n')
```

Run:
```bash
node scripts/check-contrast.js
```

### 4. Check Keyboard Navigation

**Test keyboard accessibility:**

1. Start dev server: `npm run dev`
2. Open product page
3. Use Tab key to navigate through page
4. Use Enter/Space to activate buttons

**Check:**
- [ ] All interactive elements are focusable
- [ ] Focus order is logical (top to bottom)
- [ ] Focus indicator is visible
- [ ] No keyboard traps
- [ ] Skip to main content link exists
- [ ] Dropdown menus work with keyboard
- [ ] Modal dialogs can be closed with Esc

**Add visible focus styles:**

```tsx
// Add to globals.css
:focus-visible {
  outline: 2px solid #1B3A5F;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #1B3A5F;
  outline-offset: 2px;
}
```

### 5. Check ARIA Labels

Ensure all interactive elements have proper labels:

```bash
# Find buttons without labels
grep -r "<button" app/product --include="*.tsx" | grep -v "aria-label" | grep -v ">.*</button>"

# Find inputs without labels
grep -r "<input" app/product --include="*.tsx" | grep -v "aria-label" | grep -v "<label"
```

**Fix missing labels:**

```tsx
// ❌ Bad - icon button with no label
<button onClick={handleClose}>
  <X />
</button>

// ✅ Good - has aria-label
<button onClick={handleClose} aria-label="Close dialog">
  <X />
</button>

// ✅ Better - visible label
<button onClick={handleClose}>
  <X /> Close
</button>

// ❌ Bad - input without label
<input type="text" name="email" />

// ✅ Good - with label
<label htmlFor="email">Email Address</label>
<input type="text" id="email" name="email" />

// ✅ Also good - aria-label if visual label not desired
<input
  type="text"
  name="email"
  aria-label="Email Address"
  placeholder="you@example.com"
/>
```

### 6. Check Form Accessibility

**Audit order forms:**

```tsx
// ✅ Good form accessibility
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Customer Information</legend>

    <div className="field">
      <label htmlFor="full_name">
        Full Name <span aria-label="required">*</span>
      </label>
      <input
        type="text"
        id="full_name"
        name="full_name"
        required
        aria-required="true"
        aria-describedby="name-hint"
      />
      <div id="name-hint" className="hint">
        Enter your first and last name
      </div>
    </div>

    <div className="field">
      <label htmlFor="phone">
        Phone Number <span aria-label="required">*</span>
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        required
        aria-required="true"
        aria-invalid={phoneError ? "true" : "false"}
        aria-describedby="phone-error"
        pattern="[0-9+\s\-()]+"
      />
      {phoneError && (
        <div id="phone-error" className="error" role="alert">
          {phoneError}
        </div>
      )}
    </div>

    <button type="submit" aria-busy={isSubmitting}>
      {isSubmitting ? 'Placing Order...' : 'Place Order'}
    </button>
  </fieldset>
</form>
```

**Checklist:**
- [ ] All inputs have labels (visible or aria-label)
- [ ] Required fields marked with `required` and `aria-required`
- [ ] Error messages have `role="alert"`
- [ ] Error messages linked with `aria-describedby`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Submit button shows loading state with `aria-busy`
- [ ] Fieldset groups related fields
- [ ] Legend describes field group

### 7. Check Heading Structure

Verify proper heading hierarchy:

```bash
# Find all headings
grep -r "<h[1-6]" app/product --include="*.tsx" -o | sort | uniq -c
```

**Ensure logical structure:**

```tsx
// ✅ Good - logical hierarchy
<h1>MEGIR Gift Bundle</h1>
  <h2>What's Included</h2>
    <h3>Premium Watch</h3>
    <h3>Gift Wrapping</h3>
  <h2>Customer Reviews</h2>
    <h3>John D.</h3>
    <h3>Sarah M.</h3>

// ❌ Bad - skips levels
<h1>MEGIR Gift Bundle</h1>
  <h4>What's Included</h4>  // Skipped h2 and h3!
```

**Rules:**
- Only one `<h1>` per page (product name)
- Don't skip heading levels
- Headings describe content that follows
- Use semantic headings, not just for styling

### 8. Run Automated Accessibility Tests

Create Pa11y config `pa11y.config.js`:

```javascript
module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    runners: ['axe', 'htmlcs'],
    chromeLaunchConfig: {
      args: ['--no-sandbox']
    }
  },
  urls: [
    'http://localhost:3000/',
    'http://localhost:3000/product/megir',
    'http://localhost:3000/product/megir/gift',
    'http://localhost:3000/product/megir/executive-bundle',
    'http://localhost:3000/thank-you'
  ]
}
```

Add script to [package.json](package.json):

```json
{
  "scripts": {
    "a11y": "npm run dev & sleep 5 && pa11y-ci"
  }
}
```

Run audit:
```bash
npm run a11y
```

### 9. Check Screen Reader Compatibility

**Add screen reader announcements:**

```tsx
import { useState } from 'react'

function OrderForm() {
  const [srMessage, setSrMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSrMessage('Submitting your order...')

    try {
      // ... submit logic
      setSrMessage('Order placed successfully!')
    } catch (error) {
      setSrMessage('Error placing order. Please try again.')
    }
  }

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {srMessage}
      </div>

      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
    </>
  )
}
```

Add to `globals.css`:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 10. Create Accessibility Checklist

Generate comprehensive report:

```markdown
# Accessibility Audit Report

## WCAG 2.1 AA Compliance

### ✅ Passing (X/15)
- Images have alt text
- Color contrast meets standards
- Keyboard navigation works
- Form labels present
- Heading hierarchy correct
- Skip to main content link
- Focus indicators visible
- No keyboard traps

### ❌ Issues Found (X)

#### Critical
1. Missing alt text on 3 product images
   - File: app/product/megir/gift/page.tsx:245
   - Fix: Add descriptive alt attributes

2. Low contrast on secondary text
   - Colors: #9CA3AF on #FFFFFF (3.2:1)
   - Required: 4.5:1
   - Fix: Use #6B7280 instead

#### Moderate
3. Button missing aria-label
   - File: app/product/megir/page.tsx:189
   - Fix: Add aria-label="Close modal"

4. Form error not announced
   - File: app/product/megir/gift/page.tsx:567
   - Fix: Add role="alert" to error message

### Keyboard Navigation Test
- [x] Tab order logical
- [x] All interactive elements focusable
- [x] Focus indicator visible
- [ ] Skip link present (add this)
- [x] No keyboard traps
- [x] Esc closes modals

### Screen Reader Test
- [x] Page structure makes sense
- [ ] Live region for status messages (add this)
- [x] Form labels announced
- [x] Buttons have accessible names
- [ ] Loading states announced (add this)

### Color Contrast
Component              Ratio    Required  Status
Primary button         8.2:1    4.5:1     ✅ PASS
Secondary text         3.2:1    4.5:1     ❌ FAIL
Price text            21.0:1    3.0:1     ✅ PASS
Discount badge         4.9:1    4.5:1     ✅ PASS

## Recommendations

### Immediate Actions
1. Add alt text to all images
2. Fix color contrast on secondary text
3. Add skip to main content link
4. Add aria-labels to icon buttons

### Short-term Improvements
1. Add live region for form feedback
2. Improve focus indicator visibility
3. Test with actual screen readers
4. Add keyboard shortcuts documentation

### Long-term Goals
1. Add high contrast mode
2. Support for reduced motion
3. Implement dark mode (accessible)
4. Add text resize support

## Testing Tools Used
- Pa11y (automated WCAG testing)
- axe DevTools (browser extension)
- Lighthouse (accessibility score)
- Manual keyboard navigation
- Color contrast analyzer

## Accessibility Score: XX/100
Target: 95+ for WCAG 2.1 AA compliance
```

## Common Accessibility Patterns

### Skip to Main Content

```tsx
// Add to layout.tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Add to globals.css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1B3A5F;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Accessible Modal

```tsx
function Modal({ isOpen, onClose, children }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      hidden={!isOpen}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose} aria-label="Close modal">
        <X />
      </button>
    </div>
  )
}
```

### Accessible Tabs

```tsx
function Tabs() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div role="tablist" aria-label="Product information">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
```

## Testing Checklist

- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, VoiceOver, JAWS)
- [ ] Test color contrast
- [ ] Test at 200% zoom
- [ ] Test with images disabled
- [ ] Test with CSS disabled
- [ ] Run automated Pa11y tests
- [ ] Run Lighthouse accessibility audit
- [ ] Manual review of ARIA attributes
- [ ] Test form validation messages

## Tools & Resources

**Testing Tools:**
- Pa11y CI (automated testing)
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- WAVE (web accessibility evaluation)
- Color Contrast Analyzer

**Screen Readers:**
- NVDA (Windows, free)
- JAWS (Windows, paid)
- VoiceOver (macOS, built-in)
- TalkBack (Android, built-in)
- Narrator (Windows, built-in)

**References:**
- WCAG 2.1 Guidelines
- MDN Accessibility Guide
- A11y Project Checklist
- WebAIM Resources

## Notes

- Test with real users with disabilities when possible
- Accessibility is ongoing, not one-time
- Start with high-impact fixes (images, contrast, keyboard)
- Use semantic HTML first, ARIA second
- Automated tests catch ~30% of issues - manual testing essential
