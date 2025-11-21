# Pages

Astro page components that define routes in the application.

## Modules

### `apps/astro-app/src/pages/index.astro`

Home page that displays environment variables and demonstrates package1 utilities.

**Exports**: None (Astro pages don't export - file-based routing)

**Route**: `/` (determined by filename `index.astro`)

**Component Props**: None (page component)

**Dependencies**:
- `apps/astro-app/src/layouts/Layout.astro` - Uses Layout component
- `package1` - Uses `add`, `capitalize`, `formatCurrency` utilities

**Environment Variables**:
- `PUBLIC_APP_NAME` - Application name (default: 'Astro App')
- `PUBLIC_API_URL` - API URL (default: 'http://localhost:3000')
- `MODE` - Environment name (default: 'development')

**Frontmatter**:
- Imports Layout component
- Imports package1 utilities
- Reads environment variables

**Template**:
- Wraps content in Layout component
- Displays app name, environment info, and package1 utility examples

**Styles**:
- Scoped styles for main content area
- Styles for `.info-box` class

**Gotchas**:
- Environment variables must be prefixed with `PUBLIC_` to be accessible in the browser
- Uses `MODE` instead of custom env var for environment name
- Styles are scoped to this component (not global)
- File-based routing: `index.astro` creates the `/` route

## Relationships

- Uses `apps/astro-app/src/layouts/Layout.astro` from layouts directory
- Imports utilities from `package1` workspace package
- File name determines route (`index.astro` → `/`)
