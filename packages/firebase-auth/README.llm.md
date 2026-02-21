# firebase-auth Source

Shared Firebase Authentication package for client (React, Svelte, Astro) and server (Express). Provides init helpers, env-based config, and framework bindings.

## Modules

### `packages/firebase-auth/src/types.ts`

Shared types.

**Exports**:

- `FirebaseClientConfig` - Firebase client config (apiKey, authDomain, projectId, appId)
- `InitAuthOptions` - Options for initAuth (optional config override)

### `packages/firebase-auth/src/client/index.ts`

Client SDK entry. Used by React, Svelte, Astro.

**Exports**:

- `getFirebaseConfig(env?)` - Reads config from VITE*\* or PUBLIC*\* env
- `initAuth(options?)` - Initializes Firebase app and Auth, returns Auth or null if not configured (logs console.error)
- `getAuthInstance()` - Returns cached Auth or null
- Re-exports: `createUserWithEmailAndPassword`, `onAuthStateChanged`, `signInWithEmailAndPassword`, `signOut`, `User`

### `packages/firebase-auth/src/client/react.ts`

React bindings. Peer: react.

**Exports**:

- `useAuth()` - Hook returning `{ user, loading, error, signOut, getIdToken }`
- `UseAuthResult` - Type for useAuth return value

### `packages/firebase-auth/src/client/svelte.ts`

Svelte bindings. Peer: svelte.

**Exports**:

- `authStore` - Writable store with User | null
- `authLoading` - Writable store, true while loading
- `initAuthForSvelte()` - Call once to subscribe stores to auth state

### `packages/firebase-auth/src/admin/index.ts`

Admin SDK entry. Used by Express and other Node backends.

**Exports**:

- `initAdminAuth()` - Initializes Firebase Admin, returns Auth or null if not configured
- `getAdminAuthInstance()` - Returns cached Admin Auth or null
- `verifyIdToken(token)` - Verifies Bearer token, returns DecodedIdToken | null
- `authMiddleware` - Express middleware, verifies token, attaches req.user; returns 503 if not configured
- `AuthRequest` - Express Request extended with user?: DecodedIdToken

## Relationships

- Client modules depend on `firebase`; admin depends on `firebase-admin`
- React/Svelte bindings import from `./index` (client)
- Admin is standalone, no client imports
- All config via env vars (see .env.sample)
