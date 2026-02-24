# Tailwind CSS Implementation Plan

## Overview

Add **Tailwind CSS** as a shared styling solution across React, Svelte, and Astro apps.

## Why Tailwind?

- Utility-first, no context switching
- Design tokens in one place
- Zero runtime overhead
- Works with React, Svelte, Astro

---

## Implementation

### 1. Create Package

```
packages/tailwind/
├── src/
│   ├── index.css        # Tailwind directives
│   └── theme.ts         # Custom theme tokens
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── tsconfig.json
```

### 2. Dependencies

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 3. Config (`tailwind.config.js`)

```javascript
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,svelte,astro}'],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#0ea5e9', 900: '#0c4a6e' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 4. Base Styles (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}
```

### 5. Integration

Add to each app's `package.json`:

```json
{ "dependencies": { "tailwind": "workspace:*" } }
```

Import in app CSS:

```css
@import 'tailwind/index.css';
```

For Astro, run `pnpm astro add tailwind` then extend shared config.

---

## Validate

```bash
pnpm build && pnpm lint
```

---

## Future Enhancements

- `@tailwindcss/forms` - Form styling
- `@tailwindcss/typography` - Prose content
- `@headlessui/*` - Accessible components
- Dark mode with `class` strategy
