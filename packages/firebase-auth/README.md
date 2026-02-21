# firebase-auth

Shared Firebase Authentication package for client (React, Svelte, Astro) and server (Express). Plug in with package dependency and env config.

## Quick Start

1. **Install**: `pnpm add firebase-auth` (or `workspace:*` in a monorepo)
2. **Add env**: Copy [.env.sample](.env.sample) to your app's `.env` and fill values
3. **Init**: Call `initAuth()` (client) or `initAdminAuth()` (server) once at startup

## Gradual Implementation

When env vars are not configured, the package logs `[firebase-auth]` messages to `console.error` and continues without crashing:

- **Client**: `initAuth()` returns `null`; `useAuth` / `authStore` resolve to signed-out state
- **Admin**: `initAdminAuth()` returns `null`; `authMiddleware` responds with 503

You can add the package and wire it up before configuring Firebase; the app will run and show "Not signed in" until env vars are set.

## Prerequisites

1. Create a [Firebase project](https://console.firebase.google.com)
2. Enable **Authentication** (Sign-in method → Email/Password or providers)
3. Get config: **Project Settings** → **Your apps** → SDK setup and configuration
4. For server: **Project Settings** → **Service accounts** → **Generate new private key**

## Environment Variables

| Variable                         | Used in       | Where to find                                   |
| -------------------------------- | ------------- | ----------------------------------------------- |
| `VITE_FIREBASE_API_KEY`          | React, Svelte | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN`      | React, Svelte | Usually `project-id.firebaseapp.com`            |
| `VITE_FIREBASE_PROJECT_ID`       | React, Svelte | Firebase Console                                |
| `VITE_FIREBASE_APP_ID`           | React, Svelte | Firebase Console → Your apps                    |
| `PUBLIC_FIREBASE_*`              | Astro         | Same values, use `PUBLIC_` prefix               |
| `FIREBASE_PROJECT_ID`            | Express       | Same as client                                  |
| `GOOGLE_APPLICATION_CREDENTIALS` | Express       | Path to service account JSON file               |

## React

```bash
pnpm add firebase-auth
```

Add to `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

In your app entry (e.g. `main.tsx`):

```tsx
import { initAuth } from 'firebase-auth/client'

initAuth()
```

In components:

```tsx
import { useAuth } from 'firebase-auth/client/react'

function App() {
  const { user, loading, signOut } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <LoginPage />
  return (
    <div>
      <p>Hello, {user.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
```

## Svelte

```bash
pnpm add firebase-auth
```

Add env vars (same as React). In root layout (`+layout.svelte`):

```svelte
<script>
  import { initAuthForSvelte } from 'firebase-auth/client/svelte'
  initAuthForSvelte()
</script>

<slot />
```

In components:

```svelte
<script>
  import { authStore, authLoading } from 'firebase-auth/client/svelte'
</script>

{#if $authLoading}
  <p>Loading...</p>
{:else if $authStore}
  <p>Hello, {$authStore.email}</p>
{:else}
  <a href="/login">Sign in</a>
{/if}
```

## Astro

Use `PUBLIC_` prefix for env vars. In a layout or page:

```astro
---
import { initAuth } from 'firebase-auth/client'
initAuth()
---
```

With React components (e.g. `npm run add @astrojs/react`):

```tsx
import { useAuth } from 'firebase-auth/client/react'
// Use useAuth() in your React component
```

## Express

```bash
pnpm add firebase-auth
```

Add to `.env`:

```
FIREBASE_PROJECT_ID=...
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

In `index.ts`:

```ts
import 'dotenv/config'
import { initAdminAuth, authMiddleware } from 'firebase-auth/admin'

initAdminAuth()

app.get('/api/protected', authMiddleware, (req, res) => {
  const user = (req as import('firebase-auth/admin').AuthRequest).user
  res.json({ uid: user?.uid })
})
```

## Emulator

For local testing without a live Firebase project:

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Run: `firebase emulators:start --only auth`
3. Add to `.env`:
   - Client: `VITE_FIREBASE_EMULATOR_HOST=127.0.0.1:9099`
   - Server: `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`

## Protected Routes

**React** (with TanStack Router or similar):

```tsx
const { user, loading } = useAuth()
if (loading) return <Spinner />
if (!user) return <Navigate to="/login" />
return <Outlet />
```

**Svelte** (with SvelteKit):

```svelte
{#if $authLoading}
  <p>Loading...</p>
{:else if !$authStore}
  <a href="/login">Sign in</a>
{:else}
  <slot />
{/if}
```

## Sending Tokens to API

From the client, get the ID token and send it with requests:

```ts
const { user, getIdToken } = useAuth()
const token = await getIdToken()
fetch('/api/protected', {
  headers: { Authorization: `Bearer ${token}` },
})
```

## Troubleshooting

| Issue                          | Fix                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| "Firebase config missing"      | Ensure `VITE_FIREBASE_*` or `PUBLIC_FIREBASE_*` vars are set and the app was restarted after adding them     |
| "Missing Authorization header" | Client must send `Authorization: Bearer <token>`; use `user.getIdToken()` or `getIdToken()` from `useAuth()` |
| Emulator not connecting        | Verify emulator is running (`firebase emulators:start --only auth`) and `*_EMULATOR_HOST` is set             |
| CORS errors                    | Configure your Express server to allow your app's origin                                                     |
