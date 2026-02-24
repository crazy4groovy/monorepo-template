# MSW Implementation Plan

## Overview

Add **MSW (Mock Service Worker)** for API mocking in tests.

## Why MSW?

- Network-level mocking
- Realistic HTTP behavior simulation
- Reusable across apps

---

## Implementation

### 1. Create Package

```
packages/msw/
├── src/
│   ├── index.ts        # Main exports
│   ├── browser.ts      # Browser MSW setup
│   ├── node.ts        # Node.js MSW setup
│   └── handlers/      # Shared request handlers
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "msw": "^2.0.0"
  }
}
```

### 3. Handlers (`src/handlers/index.ts`)

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/todos', () => {
    return HttpResponse.json([{ id: '1', title: 'Test', completed: false }])
  }),
  http.post('/api/todos', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: crypto.randomUUID(), ...body }, { status: 201 })
  }),
]
```

### 4. Browser Setup (`src/browser.ts`)

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### 5. Node Setup (`src/node.ts`)

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### 6. Integration

Add to each app's `package.json`:

```json
{ "devDependencies": { "msw": "workspace:*" } }
```

Add to test setup:

```typescript
import { beforeAll, afterAll } from 'vitest'
import { server } from 'msw/node'

beforeAll(() => server.listen())
afterAll(() => server.close())
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- GraphQL mocking
- Request delay simulation
- Error scenario mocking
