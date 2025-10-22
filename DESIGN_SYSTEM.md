# Matalino Design System

This document describes the design system implementation for the Matalino application, including glass-morphism effects, aurora backgrounds, custom animations, and comprehensive theming.

## Table of Contents

- [Overview](#overview)
- [Design Principles](#design-principles)
- [Installation](#installation)
- [Color System](#color-system)
- [Typography](#typography)
- [Utility Classes](#utility-classes)
- [Components](#components)
- [Animations](#animations)
- [Usage Examples](#usage-examples)

## Overview

The Matalino design system features:

- **Glass-morphism**: Semi-transparent cards with backdrop blur effects
- **Aurora Background**: Animated gradient background using brand colors
- **Dark Mode**: Dark theme by default with system preference support
- **HSL Color System**: Dynamic theming using CSS custom properties
- **Custom Animations**: Smooth micro-interactions and transitions
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Design Principles

1. **Visual Hierarchy**: Use gradient text and glass cards to create depth
2. **Consistency**: Maintain unified spacing, colors, and typography
3. **Performance**: Optimized animations with GPU acceleration
4. **Accessibility**: High contrast ratios and semantic HTML
5. **Modularity**: Reusable components and utility classes

## Installation

All required packages are already installed in the project:

```json
{
  "tailwindcss": "^3.3.6",
  "tailwindcss-animate": "^1.0.7",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.294.0"
}
```

## Color System

### Brand Colors

```css
--brand-1: 258 90% 66%;  /* Purple */
--brand-2: 199 89% 48%;  /* Blue */
--brand-3: 25 95% 53%;   /* Orange */
```

Usage in Tailwind:
```tsx
<div className="bg-brand-1">Purple background</div>
<div className="text-brand-2">Blue text</div>
<div className="border-brand-3">Orange border</div>
```

### Semantic Colors

All semantic colors are defined as HSL values and work seamlessly with dark mode:

- `background` / `foreground` - Base colors
- `card` / `card-foreground` - Card backgrounds
- `primary` / `primary-foreground` - Primary actions
- `secondary` / `secondary-foreground` - Secondary actions
- `muted` / `muted-foreground` - Subtle text and backgrounds
- `accent` / `accent-foreground` - Accent highlights
- `destructive` / `destructive-foreground` - Destructive actions

## Typography

### Font Families

- **Sans (Body)**: Inter - Default font for body text
- **Display (Headings)**: Space Grotesk - Used for headings and titles

Usage:
```tsx
<h1 className="font-display">Heading Text</h1>
<p className="font-sans">Body text</p>
```

### Text Sizes

Use Tailwind's default text sizing with the custom font families:

```tsx
<h1 className="text-5xl font-display font-bold">Large Heading</h1>
<h2 className="text-3xl font-display font-bold">Section Heading</h2>
<p className="text-base font-sans">Body paragraph</p>
<span className="text-sm text-muted-foreground">Caption text</span>
```

## Utility Classes

### Glass Card

Creates a glass-morphism effect with backdrop blur and gradient borders:

```tsx
<div className="glass-card rounded-lg p-6">
  <h3>Card Title</h3>
  <p>Card content with glass effect</p>
</div>
```

Features:
- Semi-transparent background (80% opacity)
- Backdrop blur (10px)
- Gradient border using brand colors
- Hover scale animation (1.02x)
- Inherits border radius from parent

### Text Gradient

Applies a gradient from brand-1 to brand-2:

```tsx
<h1 className="text-gradient font-display font-bold">
  Gradient Text
</h1>
```

### Hero Aurora

Full-screen animated gradient background:

```tsx
<div className="hero-aurora" />
```

Already included in the root layout at `app/layout.tsx`.

Features:
- Fixed positioning with z-index: -1
- Three radial gradients using brand colors
- Animated opacity (10s loop)
- No pointer events (non-interactive)

## Components

### Header

Responsive sticky header with glass-morphism:

```tsx
import { Header } from '@/components/header'

<Header />
```

Features:
- Sticky positioning with scroll-based compression (h-16 → h-12)
- Desktop and mobile navigation
- Active link styling with gradient underline
- CTA buttons with gradient background
- Mobile menu with slide-down animation
- Backdrop blur when scrolled

### Footer

Multi-column footer with company info and links:

```tsx
import { Footer } from '@/components/footer'

<Footer />
```

Features:
- 4-column grid layout (responsive)
- Company info with social links
- Categorized navigation links
- Copyright and legal links
- Semi-transparent background with backdrop blur

### Button

Extended button component with gradient variant:

```tsx
import { Button } from '@/components/ui/button'

// Gradient button
<Button className="bg-gradient-to-r from-brand-1 to-brand-2">
  Get Started
</Button>

// Other variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

## Animations

### Available Animations

```tsx
// Fade in with slide up
<div className="animate-fade-in">Fades in</div>

// Slide down (for dropdowns)
<div className="animate-slide-down">Slides down</div>

// Slide up (for modals)
<div className="animate-slide-up">Slides up</div>

// Floating effect
<div className="animate-float">Floats gently</div>

// Slow pulse
<div className="animate-pulse-slow">Pulses slowly</div>

// Accordion animations (built-in)
<div className="animate-accordion-down">Accordion expand</div>
<div className="animate-accordion-up">Accordion collapse</div>
```

### Animation Delays

Use inline styles for staggered animations:

```tsx
<div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
  First item
</div>
<div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
  Second item
</div>
<div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
  Third item
</div>
```

## Usage Examples

### Complete Page Layout

```tsx
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-5xl font-display font-bold text-gradient mb-6">
          Page Title
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Feature 1</h2>
            <p className="text-muted-foreground">Description</p>
          </div>
          {/* More cards... */}
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

### Hero Section

```tsx
<section className="text-center py-20 animate-fade-in">
  <h1 className="text-6xl font-display font-bold mb-6 text-gradient">
    Welcome to Matalino
  </h1>
  <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
    Build, launch, and scale your creator business with AI
  </p>
  <div className="flex gap-4 justify-center">
    <Button
      size="lg"
      className="bg-gradient-to-r from-brand-1 to-brand-2"
    >
      Get Started
    </Button>
    <Button size="lg" variant="outline">
      Learn More
    </Button>
  </div>
</section>
```

### Feature Cards Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature, index) => (
    <div
      key={feature.id}
      className="glass-card rounded-lg p-6 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <feature.icon className="h-12 w-12 text-brand-1 mb-4" />
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
      <p className="text-muted-foreground mb-4">{feature.description}</p>
      <Button variant="ghost" size="sm">
        Learn More →
      </Button>
    </div>
  ))}
</div>
```

## Demo Page

Visit `/design-system` to see a comprehensive showcase of all design system components, including:

- Typography examples
- Color palette
- Glass-morphism cards
- Button variants
- Animation demonstrations
- Layout examples

## Customization

### Modifying Brand Colors

Edit `app/globals.css`:

```css
:root {
  --brand-1: 258 90% 66%;  /* Your primary brand color */
  --brand-2: 199 89% 48%;  /* Your secondary brand color */
  --brand-3: 25 95% 53%;   /* Your accent color */
}
```

### Adjusting Glass Card Effect

Edit the `.glass-card` utility in `app/globals.css`:

```css
.glass-card {
  background: color-mix(in srgb, hsl(var(--card)) 80%, transparent);
  backdrop-filter: blur(10px); /* Adjust blur amount */
  border: 1px solid color-mix(in srgb, hsl(var(--border)) 50%, transparent);
  /* ... */
}
```

### Modifying Aurora Background

Edit the `.hero-aurora` utility in `app/globals.css`:

```css
.hero-aurora {
  /* Adjust gradient positions and opacity */
  background:
    radial-gradient(circle at 20% 30%, hsla(var(--brand-1), 0.35) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, hsla(var(--brand-2), 0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, hsla(var(--brand-3), 0.45) 0%, transparent 50%);
  filter: blur(54px); /* Adjust blur softness */
  /* ... */
}
```

## Best Practices

1. **Use glass-card sparingly** - Too many transparent elements can reduce readability
2. **Test contrast** - Ensure text remains readable on aurora backgrounds
3. **Optimize animations** - Use `will-change` and `transform` for better performance
4. **Mobile first** - Design for mobile devices first, then enhance for larger screens
5. **Semantic HTML** - Use proper heading hierarchy and ARIA labels
6. **Color accessibility** - Maintain WCAG AA contrast ratios (4.5:1 for text)

## Browser Support

- Chrome/Edge 88+
- Firefox 94+
- Safari 15.4+
- Mobile browsers (iOS Safari 15.4+, Chrome Android 88+)

Features requiring modern CSS:
- `color-mix()` function (for glass-card)
- `backdrop-filter` (for blur effects)
- CSS custom properties
- CSS animations

## Troubleshooting

### Glass effect not showing

Ensure backdrop-filter is supported and enabled in your browser.

### Animations not playing

Check that `tailwindcss-animate` plugin is installed and configured in `tailwind.config.js`.

### Colors not updating in dark mode

Verify that the `dark` class is applied to the `<html>` element.

### Font not loading

Fonts are configured in Tailwind and will fallback to system sans-serif if unavailable.

## Support

For issues or questions about the design system:

1. Check the demo page at `/design-system`
2. Review this documentation
3. Check Tailwind CSS documentation: https://tailwindcss.com
4. Open an issue in the project repository

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
