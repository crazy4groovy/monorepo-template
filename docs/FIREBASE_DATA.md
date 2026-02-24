# Firebase Data Implementation Plan

## Overview

Add **Firebase Realtime Database** with a unified API gateway pattern for CRUD operations across the monorepo.

## Why Firebase?

- Real-time sync out of the box
- Unified API gateway pattern
- Works with existing Express service
- Supports storage for binary files

---

## Implementation

### 1. Create Package

```
packages/firebase-data/
├── src/
│   ├── index.ts           # Core exports
│   ├── client.ts          # Firebase client
│   ├── types.ts          # Shared types
│   ├── storage/          # Binary file handling
│   │   └── index.ts
│   ├── react/            # React wrapper
│   │   ├── index.ts
│   │   ├── useFirebase.ts
│   │   └── client.ts
│   ├── svelte/           # Svelte wrapper
│   │   ├── index.ts
│   │   ├── store.ts
│   │   └── client.ts
│   └── astro/            # Astro wrapper
│       ├── index.ts
│       └── client.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "firebase": "^11.0.0"
  }
}
```

### 3. API Gateway Pattern

Single endpoint with envelope:

```json
{
  "operation": "create | read | update | delete | query",
  "path": "entity-name",
  "key": "optional-record-id",
  "data": "optional payload",
  "options": "optional query object"
}
```

### 4. CRUD Mapping

| Operation     | Firebase REST                              |
| ------------- | ------------------------------------------ |
| create        | `POST /{path}.json`                        |
| read          | `GET /{path}.json`                         |
| read (single) | `GET /{path}/{key}.json`                   |
| update        | `PUT /{path}/{key}.json`                   |
| delete        | `DELETE /{path}/{key}.json`                |
| query         | `GET /{path}.json?orderBy=...&equalTo=...` |

### 5. Response Contract

All responses follow:

```json
{ "success": true, "data": ... }
{ "success": false, "error": "message" }
```

### 6. Integration

Add to `services/express-service/package.json`:

```json
{ "dependencies": { "firebase-data": "workspace:*" } }
```

Add route handler:

```typescript
import { handleFirebaseOperation } from 'firebase-data'

app.post('/api', async (req, res) => {
  const result = await handleFirebaseOperation(req.body)
  res.json(result)
})
```

---

## Environment

```env
FIREBASE_DB_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_TOKEN=admin-service-account-token
```

---

## Entity Pattern

For new entity `X`:

1. Add type in `src/types.ts`
2. Create client helpers: `createX`, `getAllX`, `updateX`, `deleteX`
3. Wire up in API route

### Example: Create

```json
{ "operation": "create", "path": "users", "data": { "name": "Buddy" } }
```

### Example: Query

```json
{
  "operation": "query",
  "path": "users",
  "options": { "orderBy": "\"gender\"", "equalTo": "male", "limitToFirst": 10 }
}
```

---

## Storage (Binary Files)

Separate from database via Firebase Storage API:

- **Upload**: `POST /o/{filepath}` with binary body
- **Download**: `GET /o/{filepath}?alt=media`
- **Delete**: `DELETE /o/{filepath}`

---

## UI Framework Wrappers

### React

**Dependencies:**

```json
{
  "peerDependencies": {
    "react": ">=18"
  }
}
```

**Usage:**

```typescript
// Typed client
import { createFirebaseClient } from 'firebase-data/react'

const client = createFirebaseClient('/api')

// Hook
const { data, loading, error } = useFirebase('puppies', { limit: 10 })
const [, createPuppy] = useMutation(() => client.createPuppy)
await createPuppy({ name: 'Buddy', breed: 'Labrador' })
```

### Svelte

**Dependencies:**

```json
{
  "peerDependencies": {
    "svelte": ">=4"
  }
}
```

**Usage:**

```typescript
import { firebaseStore } from 'firebase-data/svelte'

const { data, loading } = firebaseStore('puppies')
await $firebase.createPuppy({ name: 'Buddy' })
```

### Astro

**Dependencies:**

```json
{
  "peerDependencies": {
    "astro": ">=4"
  }
}
```

**Usage:**

```typescript
---
import { getCollection, createEntry } from 'firebase-data/astro'

const puppies = await getCollection('puppies')
await createEntry('puppies', { name: 'Buddy' })
---
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- Real-time listeners for live updates
- Offline persistence
- Firebase Auth integration
- Cloud Functions for server-side triggers
