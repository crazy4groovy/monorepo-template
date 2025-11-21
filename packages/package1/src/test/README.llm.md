# Test Setup

This folder contains test configuration and setup utilities for package1.

## Modules

### `packages/package1/src/test/setup.ts`

Test configuration file that loads environment variables.

**Exports**: None (side effects only)

**Functions**:
- Imports `dotenv/config` to load environment variables from `.env` file

**Gotchas**:
- Must be imported before any code that uses `process.env`
- Loads environment variables for test environment
- Used by `packages/package1/src/index.ts` `formatCurrency` function which reads `DEFAULT_CURRENCY` and `DEFAULT_LOCALE`
