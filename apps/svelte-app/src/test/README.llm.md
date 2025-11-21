# Test Setup

This folder contains test configuration and setup utilities for the Svelte app.

## Modules

### `apps/svelte-app/src/test/setup.ts`

Test configuration file that sets up Testing Library and Vitest defaults.

**Exports**: None (side effects only)

**Functions**:
- Imports and configures `@testing-library/svelte` with custom defaults
- Sets up cleanup hooks using Vitest's `afterEach`

**Configuration**:
- `testIdAttribute`: 'data-test-id' - Use data-test-id attribute for queries
- `asyncUtilTimeout`: 1000ms - Timeout for async queries
- `defaultHidden`: false - Include hidden elements in queries by default

**Gotchas**:
- Automatically runs cleanup after each test to ensure DOM cleanup
- Uses Vitest's `afterEach` hook for cleanup coordination
- Uses `@testing-library/svelte` (not React version)
