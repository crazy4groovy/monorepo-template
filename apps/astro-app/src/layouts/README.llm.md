# Layouts

Astro layout components that wrap page content.

## Modules

### `apps/astro-app/src/layouts/Layout.astro`

Base HTML layout component with head and body structure.

**Exports**:

- `Layout` (default) - Astro component

**Component Props**:

- `title` (string, required) - Page title displayed in `<title>` tag

**Frontmatter**:

- Defines `Props` interface with `title: string`
- Extracts `title` from `Astro.props`

**Template**:

- Renders HTML5 document structure
- Includes meta tags, viewport, favicon
- Uses `<slot />` to render child content
- Includes global CSS reset styles

**Styles**:

- Global reset styles (`is:global` attribute)
- Sets box-sizing, margin, padding to 0
- Sets system font stack for body

**Gotchas**:

- Uses Astro's `is:global` attribute for global styles
- `Astro.generator` is automatically injected by Astro
- `<slot />` is where page content will be rendered

## Relationships

- Used by pages in `apps/astro-app/src/pages/` directory
- Provides base HTML structure for all pages
