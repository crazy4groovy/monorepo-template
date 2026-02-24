# Database ORM Implementation Plan

## Overview

Add **Drizzle ORM** for type-safe database operations across the monorepo.

## Why Drizzle?

- Minimal bundle size, no runtime overhead
- Full TypeScript inference from schema
- Works with PostgreSQL, MySQL, SQLite, Cloudflare D1
- Built-in migration tooling

---

## Implementation

### 1. Create Package

```
packages/database/
├── src/
│   ├── index.ts           # Main exports
│   ├── client.ts          # DB client singleton
│   ├── schema.ts          # Shared schemas
│   └── migrations/        # SQL migrations
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "drizzle-orm": "^0.40.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0"
  }
}
```

### 3. Schema (`src/schema.ts`)

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### 4. Client (`src/client.ts`)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const queryClient = postgres(process.env.DATABASE_URL!)
export const db = drizzle(queryClient, { schema })
```

### 5. Integration

Add to `services/express-service/package.json`:

```json
{ "dependencies": { "database": "workspace:*" } }
```

Add to `apps/*/package.json` as needed.

### 6. Scripts

Add to `packages/database/package.json`:

```json
{
  "scripts": {
    "migrate": "drizzle-kit migrate",
    "generate": "drizzle-kit generate"
  }
}
```

---

## Environment

```env
DATABASE_URL=postgres://user:pass@localhost:5432/monotemplate
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- Connection pooling (PgBouncer)
- Read replicas for scaling
- Database seeding utilities
