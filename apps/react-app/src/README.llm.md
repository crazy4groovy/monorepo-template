# React App Source

Main source code for the React application built with Vite and TypeScript.

## Modules

### `apps/react-app/src/App.tsx`

Main application component that displays environment variables and demonstrates package1 utilities.

**Exports**:

- `App` (default) - React functional component

**Component Props**: None

**Dependencies**:

- `package1` - Uses `add`, `capitalize`, `formatCurrency` utilities

**Environment Variables**:

- `VITE_APP_NAME` - Application name (default: 'React App')
- `VITE_API_URL` - API URL (default: 'http://localhost:3000')
- `VITE_ENV` - Environment name (default: 'development')

**Gotchas**:

- Uses inline styles for styling (no CSS modules or styled-components)
- Environment variables must be prefixed with `VITE_` to be accessible in the browser

### `apps/react-app/src/main.tsx`

Application entry point that renders the React app into the DOM.

**Exports**: None (side effects only)

**Functions**:

- Creates React root and renders `App` component wrapped in `StrictMode`
- Assumes `#root` element exists in HTML

**Dependencies**:

- `react` - React library
- `react-dom/client` - React DOM client API
- `apps/react-app/src/App.tsx` - Main app component

**Gotchas**:

- Uses non-null assertion (`!`) on `getElementById` - assumes root element exists
- Wraps app in `React.StrictMode` for development checks

### `apps/react-app/src/vite-env.d.ts`

TypeScript type definitions for Vite environment variables.

**Exports**: None (type definitions only)

**Purpose**: Provides TypeScript types for Vite-specific globals and environment variables

### `apps/react-app/src/test/setup.ts`

Test configuration - see `apps/react-app/src/test/README.llm.md` for details.

## Relationships

- `apps/react-app/src/main.tsx` imports and renders `apps/react-app/src/App.tsx`
- `apps/react-app/src/App.tsx` imports utilities from `package1` workspace package
- All components use Vite's `import.meta.env` for environment variables
