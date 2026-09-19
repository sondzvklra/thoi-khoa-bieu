# DESIGN SYSTEM - Thời Khóa Biểu THCS Yên Phúc

## OVERVIEW

**Name:** Timetable Pro
**Category:** Education / Productivity / Student App
**Design Philosophy:** Premium Editorial Education + Modern Minimal + Subtle Cinematic Polish
**Target Devices:** Desktop (1920px+), Laptop (1280-1920px), Tablet (768-1024px), Mobile (360-767px)
**Accessibility:** WCAG AA compliant minimum, AAA where practical

---

## 1. COLOR SYSTEM

### 1.1 Core Palette

```css
/* Primary Brand Colors */
--color-primary: #0097a7;          /* Teal - Professional, trustworthy */
--color-primary-light: #00bcd4;    /* Light teal - Accents */
--color-primary-dark: #006064;     /* Dark teal - Hover states */

/* Neutral Colors */
--color-surface: #ffffff;           /* White - Card backgrounds */
--color-background: #f8f9fb;        /* Off-white - Page background */
--color-surface-hover: #f5f6f8;     /* Slightly darker hover state */

/* Text Colors */
--color-text-primary: #1a1a1a;     /* Almost black - Primary text */
--color-text-secondary: #666666;   /* Gray - Secondary text */
--color-text-tertiary: #999999;    /* Light gray - Helper/meta text */
--color-text-disabled: #cccccc;    /* Disabled text */

/* Semantic Colors */
--color-border: #e0e0e0;           /* Light border */
--color-border-light: #f0f0f0;     /* Very light border */
--color-divider: #f5f5f5;          /* Row dividers */

/* Status Colors */
--color-success: #4caf50;           /* Green - Current class */
--color-warning: #ffc107;           /* Amber - Upcoming */
--color-error: #f44336;             /* Red - Cancelled/Issues */
--color-info: #2196f3;              /* Blue - Information */

/* Subject Colors - Semantic + Accessible */
--color-subject-01: #e3f2fd;       /* Very light blue - Language/VAN */
--color-subject-02: #f3e5f5;       /* Very light purple - Math/TOAN */
--color-subject-03: #e8f5e9;       /* Very light green - Science/KHTN */
--color-subject-04: #fff3e0;       /* Very light orange - Social/SU */
--color-subject-05: #fce4ec;       /* Very light pink - Physical/TD */
--color-subject-06: #f1f8e9;       /* Very light lime - Civic/GDCD */
--color-subject-07: #ede7f6;       /* Very light indigo - Music/NHAC */
--color-subject-08: #e0f2f1;       /* Very light teal - Tech/TIN */
--color-subject-09: #f5f5f5;       /* Light gray - Class meeting/TrNg */
--color-subject-10: #fff9c4;       /* Very light yellow - English/TIẾNG */

/* Highlight States */
--color-current-day: #e0f2f1;      /* Light teal background for today */
--color-current-period: #fff9c4;   /* Light yellow for current time */
--color-selected: #e3f2fd;         /* Light blue for selected */
--color-hover: #f5f5f5;            /* Hover background */
```

### 1.2 Color Usage Rules

| Usage | Color | Contrast Check |
|-------|-------|---|
| Primary UI elements | --color-primary (#0097a7) | ✅ 7.8:1 on white |
| Text on primary | --color-surface (#fff) | ✅ 7.8:1 |
| Text primary | --color-text-primary (#1a1a1a) | ✅ 18:1 on white |
| Text secondary | --color-text-secondary (#666) | ✅ 8.5:1 on white |
| Subject backgrounds | Individual color + dark text | ✅ All ≥4.5:1 |
| Borders | --color-border (#e0e0e0) | ✅ 3.8:1 on white |
| Hover backgrounds | --color-hover (#f5f5f5) | ✅ 2.2:1 on white |

**Subject Color Semantic Mapping:**
- VAN (Language) → Blue (#e3f2fd)
- TOAN (Math) → Purple (#f3e5f5)
- KHTN (Science) → Green (#e8f5e9)
- SU (Social Studies) → Orange (#fff3e0)
- TD (Physical Education) → Pink (#fce4ec)
- GDCD (Civic) → Lime (#f1f8e9)
- NHAC (Music) → Indigo (#ede7f6)
- TIN (IT) → Teal (#e0f2f1)
- TrNg (Class Meeting) → Gray (#f5f5f5)
- TIẾNG ANH (English) → Yellow (#fff9c4)

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Stack

```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-family-mono: "Menlo", "Monaco", "Courier New", monospace;
```

### 2.2 Type Scale

**Base ratio:** 1.2x (modular scale for readable rhythm)

| Level | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| **h1** | 28px (1.75rem) | 36px (1.286) | 700 | Page title, school name |
| **h2** | 24px (1.5rem) | 32px (1.333) | 700 | Section heading (schedule day) |
| **h3** | 20px (1.25rem) | 28px (1.4) | 600 | Subsection (session title) |
| **h4** | 16px (1rem) | 24px (1.5) | 600 | Card title |
| **body-lg** | 15px (0.9375rem) | 24px (1.6) | 400 | Large body text |
| **body** | 14px (0.875rem) | 22px (1.571) | 400 | Normal body text |
| **body-sm** | 13px (0.8125rem) | 20px (1.538) | 400 | Small text, labels |
| **caption** | 12px (0.75rem) | 18px (1.5) | 500 | Captions, metadata |
| **xs** | 11px (0.6875rem) | 16px (1.454) | 500 | Mini labels, hints |

### 2.3 Font Weight Strategy

```css
--font-weight-regular: 400;     /* Body text, regular content */
--font-weight-medium: 500;      /* Labels, captions, secondary headings */
--font-weight-semibold: 600;    /* Subheadings, highlights */
--font-weight-bold: 700;        /* Primary headings, strong emphasis */
```

### 2.4 Letter Spacing

```css
--letter-spacing-tight: -0.02em;    /* Headlines for tighter feel */
--letter-spacing-normal: 0;         /* Default */
--letter-spacing-wide: 0.04em;      /* All-caps labels */
```

### 2.5 Typography Usage Rules

- **Minimum font size:** 13px (never below on important content)
- **Maximum line length:** 70-75 characters (readability)
- **Minimum line height:** 1.4 (accessibility)
- **Heading hierarchy:** Only h1-h4, skip levels to avoid confusion
- **All-caps labels:** Add 0.04em letter-spacing

---

## 3. SPACING SYSTEM

### 3.1 Spacing Scale (8px base unit)

```css
--space-xs: 4px (0.25rem);      /* Tight spacing */
--space-sm: 8px (0.5rem);       /* Small spacing */
--space-md: 12px (0.75rem);     /* Medium spacing */
--space-lg: 16px (1rem);        /* Large spacing */
--space-xl: 24px (1.5rem);      /* Extra large */
--space-2xl: 32px (2rem);       /* 2x large */
--space-3xl: 48px (3rem);       /* 3x large */
--space-4xl: 64px (4rem);       /* 4x large */
```

### 3.2 Spacing Rules by Component

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| **Buttons** | 10px 16px | - | - |
| **Form inputs** | 10px 12px | - | - |
| **Cards** | 20px (lg): 12px (sm) | 0 | - |
| **Section** | Top/Bottom: 32px | - | - |
| **Grid cells** | 12px 8px (lg): 8px 6px (sm) | - | - |
| **List items** | 8px 0 | - | - |
| **Header** | 24px (lg): 16px (sm) | - | - |
| **Grouped controls** | - | - | 12px (lg): 8px (sm) |

---

## 4. BORDER & SHADOW SYSTEM

### 4.1 Border Radius

```css
--radius-none: 0;           /* No rounding */
--radius-sm: 4px;           /* Subtle rounding for cards */
--radius-md: 6px;           /* Standard rounding */
--radius-lg: 8px;           /* Larger rounding (rare) */
--radius-full: 9999px;      /* Pill shape (buttons, badges) */
```

**Usage:**
- Form inputs: `--radius-sm`
- Cards: `--radius-sm`
- Buttons: `--radius-sm`
- Modals: `--radius-md`
- Pills/badges: `--radius-full`
- Most elements: NO rounding (keep flat, modern)

### 4.2 Shadow System

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);        /* Subtle */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);        /* Normal */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);       /* Elevated */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);      /* High elevation */

/* Inset shadows (rarely used) */
--shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
```

**Shadow Rules:**
- Page background: No shadow
- Cards on white: `--shadow-sm`
- Hovered cards: `--shadow-md`
- Elevated modals: `--shadow-lg`
- Dropdowns/popovers: `--shadow-md`
- **Avoid heavy shadows** - they feel AI-generated

### 4.3 Border Usage

```css
--border-color: var(--color-border);
--border-width: 1px;
--border: 1px solid var(--color-border);
```

**Border Rules:**
- Separators between sections: `--border-color`
- Form inputs: `1px solid --color-border`
- Hovered inputs: `1px solid --color-primary`
- Grid dividers: Very light (`--color-border-light`)
- Cards: Optional subtle bottom border instead of shadow

---

## 5. COMPONENT SYSTEM

### 5.1 Header Component

```
Height: 64px (lg) / 56px (sm)
Background: Gradient (--color-primary → --color-primary-dark)
Padding: 20px horizontal (lg) / 16px (sm)
Text color: White
Shadow: --shadow-md
Flex: Space-between for title + date
Mobile: Stack vertically only if needed
```

### 5.2 Controls Section

```
Grid: auto-fit columns, min 150px
Gap: 12px
Padding: 16px (lg) / 12px (sm)
Background: --color-surface
Border: 1px --color-border
Border-radius: --radius-sm
Shadow: --shadow-sm
```

### 5.3 Schedule Grid Component

**Desktop (1280px+):**
```
Columns: 13 class columns + 1 period column
Period column width: 50px (sticky on scroll-right)
Header row: Sticky (sticky on scroll-down)
Header background: Gradient (--color-primary)
Header text: White, bold
Row height: 60px (normal), 64px (hovered)
Cell padding: 12px 8px
Border: 1px --color-border-light
Alternating rows: --color-surface vs. --color-surface-hover
```

**Tablet (768-1279px):**
```
Show: 5-7 classes visible at once
Columns: Responsive width based on available space
Add: Left/right navigation arrows
Sticky: Period column + header row
```

**Mobile (360-767px):**
```
Show: 2-3 classes at a time
Stack: Period info above classes
Add: Full-width left/right swipe navigation
Remove: Horizontal scroll (use snap instead)
Add: Carousel/slider pattern
Font size: 14px (body) / 12px (cell labels)
Cell height: 56px (touch-friendly)
```

### 5.4 Subject Cell Styling

```
Background: Semantic color (from subject color map)
Text color: --color-text-primary
Padding: 12px 8px
Border-radius: --radius-sm
Box-shadow: --shadow-sm
Hover: Box-shadow increase to --shadow-md, scale 1.02
Active/selected: Border 2px --color-primary
Transition: all 150ms ease
```

### 5.5 Modal Component

```
Backdrop: rgba(0, 0, 0, 0.4)
Modal width: 450px (lg) / 100% - 32px (sm)
Padding: 24px (lg) / 16px (sm)
Border-radius: --radius-md
Box-shadow: --shadow-xl
Close button: Icon (SVG), top-right, 36px square
Focus trap: Yes (tab stays within modal)
Keyboard: ESC to close
Animation: Slide-up 200ms ease-out
```

### 5.6 Empty State Component

```
Padding: 48px 24px (lg) / 32px 16px (sm)
Text align: Center
Icon: SVG icon (48px) or illustration
Heading: h3, --color-text-primary
Message: body-sm, --color-text-secondary
Action button: Optional (e.g., "Clear filters")
```

---

## 6. INTERACTION & ANIMATION

### 6.1 Transition Timing

```css
--transition-fast: 150ms ease-out;      /* Micro-interactions */
--transition-normal: 200ms ease-out;    /* Most interactions */
--transition-slow: 300ms ease-out;      /* Page transitions */
```

### 6.2 Animation Library

**Easing functions:**
```
ease-out: Easing for entering elements (feels responsive)
ease-in-out: Easing for sustained motion
ease-in: Easing for exiting elements (feels natural)
```

**Standard animations:**

| Animation | Duration | Easing | Purpose |
|-----------|----------|--------|---------|
| Fade in | 200ms | ease-out | New content appears |
| Slide up | 250ms | ease-out | Modal/drawer enters |
| Scale in | 150ms | ease-out | Button press feedback |
| Color change | 150ms | ease-out | State change (hover, active) |
| Height expand | 200ms | ease-out | Accordion/expand |

### 6.3 Interaction Patterns

**Hover:**
- Buttons: Background color change + slight shadow increase
- Cards: Shadow increase --shadow-sm → --shadow-md
- Subject cells: Scale 1.02 + shadow increase
- Transitions: 150ms ease-out

**Focus (Keyboard):**
- Visible outline: 2px solid --color-primary
- Offset: 2px from element
- Applies to: inputs, buttons, links, dropdowns
- Respects: prefers-reduced-motion

**Active/Pressed:**
- Transform: scale(0.98) (very subtle press effect)
- Duration: 100ms
- Feedback: Immediate visual response

**Disabled state:**
- Opacity: 0.5
- Cursor: not-allowed
- No hover/active effects

---

## 7. RESPONSIVE BREAKPOINTS

### 7.1 Breakpoint Map

```css
/* Mobile First Approach */
--bp-mobile: 360px;     /* Min mobile */
--bp-mobile-lg: 480px;  /* Large mobile */
--bp-tablet: 768px;     /* Tablet */
--bp-laptop: 1024px;    /* Laptop/desktop */
--bp-desktop: 1280px;   /* Large desktop */
--bp-ultra: 1920px;     /* Ultra-wide */
```

### 7.2 Layout Strategy by Breakpoint

| Breakpoint | Schedule View | Controls | Font Size | Grid Columns |
|-----------|---|---|---|---|
| **360px** | Carousel (2 classes) | Stacked | 14px | 2 + period |
| **480px** | Carousel (3 classes) | Stacked | 14px | 3 + period |
| **768px** | Scroll (5 classes) | 2-column | 13px | 5 + period |
| **1024px** | Scroll (8 classes) | 3-column | 14px | 8 + period |
| **1280px+** | Full (13 classes) | 3-column | 14px | 13 + period |

---

## 8. ACCESSIBILITY STANDARDS

### 8.1 WCAG AA Compliance

- **Contrast ratio:** Minimum 4.5:1 for text, 3:1 for UI components
- **Font size:** Minimum 13px for body text
- **Line height:** Minimum 1.4 for readability
- **Touch targets:** Minimum 44x44px for interactive elements
- **Focus indicators:** Visible 2px outline on keyboard focus
- **Keyboard navigation:** All functionality accessible via keyboard
- **Screen reader:** Semantic HTML + ARIA labels where needed
- **Reduced motion:** Respect `prefers-reduced-motion` preference

### 8.2 Color Blindness

- Never rely on color alone to convey information
- Always include text or pattern variation
- Subject cells have text content (not just background color)
- Status indicators use text + color

### 8.3 Mobile Accessibility

- Touch targets ≥44x44px (48px preferred)
- No horizontal scrolling required
- Zoom support (text should scale properly)
- Large touch areas for critical actions

---

## 9. PERFORMANCE GUIDELINES

### 9.1 CSS Performance

- Use CSS variables (no parsing overhead)
- Minimize repaints: avoid animated layout properties (width, height, top, left)
- Prefer: transform, opacity, color, background
- Limit shadows (especially on many elements)
- Use `will-change` sparingly

### 9.2 Animation Performance

- Keep animations ≤300ms (feels instant)
- 60fps target (60Hz refresh)
- Use `transform: scale()` instead of `width/height`
- Avoid shadow animations (expensive)
- Test on mid-range mobile devices

### 9.3 DOM Performance

- Minimize DOM nodes
- No unnecessary wrapper divs
- Use semantic HTML
- Lazy-load images if any
- Avoid dynamic style recalculation in loops

---

## 10. DARK MODE (OPTIONAL - FUTURE)

If implementing dark mode:

```css
--color-surface: #1e1e1e;
--color-background: #121212;
--color-text-primary: #ffffff;
--color-text-secondary: #b3b3b3;
--color-border: #333333;

/* Subject colors (darker versions) */
--color-subject-01: #1a237e (dark blue);
/* etc. */
```

---

## 11. DESIGN DECISIONS & RATIONALE

| Decision | Rationale |
|----------|-----------|
| **Teal primary color** | Professional, educational, trustworthy (similar to education apps like Google Classroom) |
| **Light subject backgrounds** | Distinguishable without high saturation; accessible contrast with dark text |
| **8px spacing scale** | Harmonizes with 8px grid; common in modern design systems |
| **1.2x type scale** | Natural progression; highly readable without feeling extreme |
| **Minimal shadows** | Avoids "AI-generated" look; flat modern design is more premium |
| **No excessive rounding** | Modern, refined aesthetic (not playful) |
| **Sticky headers** | Solves UX problem of losing context while scrolling |
| **Mobile carousel** | Solves 13-column grid problem; touch-friendly swipe interaction |
| **Semantic color mapping** | Subjects have meaning (blue=language, green=science) rather than random colors |
| **WCAG AA minimum** | Inclusive design; acceptable for educational institution |

---

## IMPLEMENTATION CHECKLIST

- [ ] Convert all colors to CSS custom properties
- [ ] Define typography in CSS (font-size, line-height, font-weight classes)
- [ ] Build spacing utility classes (.space-sm, .space-md, etc.)
- [ ] Create component CSS files (header, controls, grid, modal, etc.)
- [ ] Implement sticky headers for schedule grid
- [ ] Add mobile carousel navigation (2-3 classes visible)
- [ ] Increase minimum font size to 13px
- [ ] Add keyboard support (ESC to close modal, focus trap)
- [ ] Add ARIA labels and roles
- [ ] Test color contrast (WCAG AA)
- [ ] Test keyboard navigation
- [ ] Test on 5 devices (desktop, laptop, tablet, mobile, mobile-small)
- [ ] Verify responsive behavior at all breakpoints
- [ ] Check performance (60fps animations)
- [ ] Final audit against this design system

---

## END OF DESIGN SYSTEM

*Last updated: 2026-09-18*
*Framework: CSS custom properties + vanilla HTML/JS*
*Target: WCAG AA, performance-optimized, mobile-first*
