# Playwright E2E Implementation Plan

## Overview

Add **Playwright** for end-to-end testing across all UI apps.

## Why Playwright?

- Cross-browser testing (Chromium, Firefox, WebKit)
- Auto-waiting for elements
- Built-in tracing and debugging
- Parallel test execution
- Native mobile emulation

---

## Implementation

### 1. Create Package

```
packages/e2e/
├── src/
│   ├── index.ts           # Config exports
│   ├── config.ts         # Playwright config
│   ├── fixtures/         # Shared fixtures
│   │   └── index.ts
│   ├── page-objects/     # Shared page objects
│   │   ├── BasePage.ts
│   │   └── ...
│   └── utils.ts         # Helper functions
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

### 2. Dependencies

```json
{
  "dependencies": {
    "@playwright/test": "^1.50.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0"
  }
}
```

### 3. Config (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 4. Fixtures (`src/fixtures/index.ts`)

```typescript
import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await use(page)
  },
})

export { expect } from '@playwright/test'
```

### 5. Page Object (`src/page-objects/BasePage.ts`)

```typescript
import { Page, Locator } from '@playwright/test'

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
  }

  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector)
  }
}
```

### 6. Integration

Add to each app's `package.json`:

```json
{
  "devDependencies": {
    "e2e": "workspace:*"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

## Environment

```env
BASE_URL=http://localhost:5173
CI=true
```

---

## Usage

### Basic Test

```typescript
import { test, expect } from 'e2e/fixtures'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/My App/)
})
```

### With Page Object

```typescript
import { test } from 'e2e/fixtures'
import { HomePage } from 'e2e/page-objects/HomePage'

test('user can navigate', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await home.clickLogin()
  await expect(page).toHaveURL('/login')
})
```

---

## CI Integration

Add to `.github/workflows/ci.yml`:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
      with:
        version: 8
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm test:e2e
```

---

## Validate

```bash
pnpm test:e2e
pnpm test:e2e:ui     # Visual UI mode
pnpm test:e2e:headed  # Headed browser
```

---

## Future Enhancements

- Visual regression testing with `@playwright/test/reporters`
- Mobile device emulation
- API testing with Playwright
- Visual diff reporting (Percy, Chromatic)
- Test parametrization for multi-environment testing
