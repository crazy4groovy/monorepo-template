# Test Setup

This folder contains test configuration and setup utilities for the Astro app.

## Modules

### `apps/astro-app/src/test/setup.ts`

Test configuration file that sets up Testing Library and Vitest defaults for React components used in Astro.

**Exports**: None (side effects only)

**Functions**:

- Imports and configures `@testing-library/react` with custom defaults
- Sets up cleanup hooks using Vitest's `afterEach`

**Configuration**:

- `testIdAttribute`: 'data-test-id' - Use data-test-id attribute for queries
- `asyncUtilTimeout`: 1000ms - Timeout for async queries
- `defaultHidden`: false - Include hidden elements in queries by default

**Gotchas**:

- Uses React Testing Library (not Astro-specific) because Astro uses React components
- Automatically runs cleanup after each test to ensure DOM cleanup
- Uses Vitest's `afterEach` hook for cleanup coordination
