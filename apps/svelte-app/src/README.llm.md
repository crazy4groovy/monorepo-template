# Svelte App Source

Main source code for the Svelte application built with Vite and TypeScript.

## Modules

### `apps/svelte-app/src/App.svelte`

Main application component that displays environment variables and demonstrates package1 utilities.

**Exports**:

- `App` (default) - Svelte component

**Component Props**: None

**Dependencies**:

- `package1` - Uses `add`, `capitalize`, `formatCurrency` utilities

**Environment Variables**:

- `VITE_APP_NAME` - Application name (default: 'Svelte App')
- `VITE_API_URL` - API URL (default: 'http://localhost:3000')
- `VITE_ENV` - Environment name (default: 'development')

**Gotchas**:

- Uses inline styles in the template (Svelte style)
- Environment variables must be prefixed with `VITE_` to be accessible
- Script section uses `<script lang="ts">` for TypeScript support

### `apps/svelte-app/src/main.ts`

Application entry point that instantiates and mounts the Svelte app.

**Exports**:

- `app` (default) - Svelte component instance

**Functions**:

- Creates new `App` component instance
- Mounts to `#app` element in DOM

**Dependencies**:

- `apps/svelte-app/src/app.css` - Global styles
- `apps/svelte-app/src/App.svelte` - Main app component

**Gotchas**:

- Uses non-null assertion (`!`) on `getElementById` - assumes app element exists
- Exports the component instance (can be useful for programmatic access or testing)

### `apps/svelte-app/src/app.css`

Global CSS styles for the application.

**Exports**: None (CSS only)

**Purpose**: Contains global styles imported by `apps/svelte-app/src/main.ts`

### `apps/svelte-app/src/vite-env.d.ts`

TypeScript type definitions for Vite environment variables.

**Exports**: None (type definitions only)

**Purpose**: Provides TypeScript types for Vite-specific globals and environment variables

### `apps/svelte-app/src/test/setup.ts`

Test configuration - see `apps/svelte-app/src/test/README.llm.md` for details.

## Relationships

- `apps/svelte-app/src/main.ts` imports and instantiates `apps/svelte-app/src/App.svelte`
- `apps/svelte-app/src/App.svelte` imports utilities from `package1` workspace package
- All components use Vite's `import.meta.env` for environment variables
