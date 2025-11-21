# Package1 Source

Shared utility package providing common functions for string manipulation, number operations, and currency formatting.

## Modules

### `packages/package1/src/index.ts`

Main module exporting all utility functions.

**Exports**:

#### `capitalize(str: string): string`

Capitalizes the first letter of a string and lowercases the rest.

**Parameters**:

- `str` (string) - String to capitalize

**Returns**: (string) - Capitalized string, or original string if empty/falsy

**Gotchas**:

- Returns original string if input is falsy (empty string, null, undefined)
- Only capitalizes first character, lowercases the rest

#### `add(a: number, b: number): number`

Adds two numbers together.

**Parameters**:

- `a` (number) - First number
- `b` (number) - Second number

**Returns**: (number) - Sum of a and b

**Gotchas**: None (simple addition)

#### `multiply(a: number, b: number): number`

Multiplies two numbers together.

**Parameters**:

- `a` (number) - First number
- `b` (number) - Second number

**Returns**: (number) - Product of a and b

**Gotchas**: None (simple multiplication)

#### `formatCurrency(amount: number, currency?: string, locale?: string): string`

Formats a number as currency using Intl.NumberFormat.

**Parameters**:

- `amount` (number) - Amount to format
- `currency` (string, optional) - Currency code. Defaults to 'USD' if not provided.
- `locale` (string, optional) - Locale for formatting. Defaults to 'en-US' if not provided.

**Returns**: (string) - Formatted currency string (e.g., '$1,234.56')

**Gotchas**:

- Uses browser/Node.js Intl API for formatting
- Both currency and locale parameters are optional with sensible defaults
- Works in both browser and Node.js environments

### `packages/package1/src/test/setup.ts`

Test configuration - see `packages/package1/src/test/README.llm.md` for details.

## Relationships

- Used by all apps (react-app, svelte-app, astro-app) and express-service
- Functions are pure utilities with no side effects
- Package is consumed via workspace protocol (`workspace:*`)
