# GSAP Animation Implementation Plan

## Overview

Add **GSAP (GreenSock Animation Platform)** for professional-grade animations across all UI apps.

## Why GSAP?

- Industry-standard, used on 11M+ sites
- Animate CSS, SVG, Canvas, React components
- High performance, cross-browser compatible
- ScrollTrigger for scroll-based animations

---

## Implementation

### 1. Create Package

```
packages/gsap/
├── src/
│   ├── index.ts        # Main exports
│   ├── animations/     # Reusable animations
│   │   ├── fadeIn.ts
│   │   ├── slideUp.ts
│   │   └── stagger.ts
│   ├── hooks/         # Framework hooks
│   │   ├── useGSAP.ts
│   │   └── useScrollTrigger.ts
│   └── utils.ts       # Helper functions
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "gsap": "^3.12.0"
  },
  "peerDependencies": {
    "react": ">=16",
    "svelte": ">=4"
  }
}
```

### 3. Basic Animation (`src/animations/fadeIn.ts`)

```typescript
import gsap from 'gsap'

export function fadeIn(element: gsap.TweenTarget, options = {}) {
  return gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.5, ...options })
}
```

### 4. ScrollTrigger Setup (`src/animations/scrollReveal.ts`)

```typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function scrollReveal(element: gsap.TweenTarget) {
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  })
}
```

### 5. React Hook (`src/hooks/useGSAP.ts`)

```typescript
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGSAP(callback: () => void | gsap.core.Tween) {
  const ref = useRef<gsap.core.Tween>()

  useLayoutEffect(() => {
    ref.current = callback() || undefined
    return () => ref.current?.kill()
  }, [callback])
}
```

### 6. Integration

Add to each app's `package.json`:

```json
{ "dependencies": { "gsap": "workspace:*" } }
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Popular Plugins

- **ScrollTrigger** - Scroll-based animations
- **Draggable** - Drag interactions
- **Flip** - State-based layout transitions
- **MorphSVG** - SVG shape morphing

---

## Future Enhancements

- Pre-built animation presets
- Page transition utilities
- Gesture-based animations
- Lottie integration for complex animations
