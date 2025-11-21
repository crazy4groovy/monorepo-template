# Test Setup

This folder contains test configuration and setup utilities for the Express service.

## Modules

### `services/express-service/src/test/setup.ts`

Test configuration file that loads environment variables.

**Exports**: None (side effects only)

**Functions**:
- Imports `dotenv/config` to load environment variables from `.env` file

**Gotchas**:
- Must be imported before any code that uses `process.env`
- Loads environment variables for test environment
