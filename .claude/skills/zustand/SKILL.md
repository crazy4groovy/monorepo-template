---
name: zustand
description: State management for React and Svelte using Zustand. Use for global app state with stores, slices, and actions. All API calls should route through store/slice actions - optionally use TanStack Query for server state, but data flow always goes through Zustand stores.
---

# Zustand Skill

## Core Pattern

Store is a hook. All state and API calls live in the store/slice.

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
  fetchBears: () => Promise<void>
}

const useBearStore = create<BearState>((set, get) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  fetchBears: async () => {
    const res = await fetch('/api/bears')
    const data = await res.json()
    set({ bears: data.bears })
  },
}))
```

## React Usage

```typescript
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} bears</h1>
}

function Controls() {
  const increase = useBearStore((state) => state.increase)
  return <button onClick={() => increase(1)}>Add bear</button>
}
```

## Svelte Usage

Use `zustand/vanilla` with Svelte store wrapper:

```typescript
// stores/bearStore.ts
import { createStore } from 'zustand/vanilla'
import { readable } from 'svelte/store'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const store = createStore<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

export const bearStore = readable(store.getState(), (set) => {
  const unsub = store.subscribe((state) => set(state))
  return unsub
})

export const bearActions = {
  increase: (by: number) => store.getState().increase(by),
}
```

```svelte
<script>
  import { bearStore, bearActions } from './stores/bearStore'
</script>

<h1>{$bearStore.bears} bears</h1>
<button on:click={() => bearActions.increase(1)}>Add</button>
```

## Slices Pattern

Split large stores into slices:

```typescript
// stores/slices/bearSlice.ts
import { StateCreator } from 'zustand'

interface BearSlice {
  bears: number
  increase: (by: number) => void
}

export const createBearSlice: StateCreator<Store, [], [], BearSlice> = (set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
})

// stores/index.ts
import { create } from 'zustand'
import { createBearSlice } from './slices/bearSlice'

type Store = BearSlice // Add more slices

export const useStore = create<Store>()((...a) => ({
  ...createBearSlice(...a),
}))
```

## API Calls Through Store

**Rule**: All API calls go through store actions, never directly in components.

```typescript
// GOOD - API call in store action
const useUserStore = create((set) => ({
  user: null,
  fetchUser: async (id: string) => {
    const res = await fetch(`/api/users/${id}`)
    const user = await res.json()
    set({ user })
  },
}))

// BAD - API call in component
function User() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/user').then(setUser) // Don't do this
  }, [])
}
```

## TanStack Query (Optional)

For server state (caching, refetching, etc.), wrap query in store:

```typescript
import { create } from 'zustand'
import { useQuery } from '@tanstack/react-query'

const useUserStore = create((set) => ({
  userId: null,
  setUserId: (id: string) => set({ userId: id }),
}))

// Use in component - data flows through store
function UserProfile() {
  const userId = useUserStore((s) => s.userId)
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
  // ...
}
```

Or use Zustand for query cache:

```typescript
import { create } from 'zustand'
import { queryOptions } from '@tanstack/query'

const useUserStore = create((set, get) => ({
  userQueryOptions: (id: string) =>
    queryOptions({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    }),
  // Store query client state if needed
  invalidateUsers: () => {
    // Trigger refetch via queryClient
  },
}))
```

## Page State Belongs in Store

**Page state goes in Zustand, NOT in local component state (useState), unless it intentionally resets on page unmount/mount.**

```typescript
// GOOD - Page state in store (persists across navigation)
const useUserStore = create((set) => ({
  filters: { search: '', sort: 'asc' },
  setFilters: (filters) => set({ filters }),
}))

function UserPage() {
  const filters = useUserStore((s) => s.filters)
  // State persists when navigating away and back
}

// BAD - Page state in useState (resets on every mount)
function UserPage() {
  const [filters, setFilters] = useState({ search: '', sort: 'asc' })
  // State resets when component remounts
}
```

**Exception**: Use local state only when:

- State should reset on every page visit (form inputs, ephemeral UI)
- State is truly private to one component (modals, toggles)
- State is performance-sensitive and changes rapidly (animation frames)

Even for these cases, consider if the state should arguably be in a store for consistency and testability.

1. **Store as single source** - All state in Zustand, not scattered in useState
2. **API through actions** - Never fetch directly in components
3. **TanStack Query optional** - Use for caching/background refetch, but route through store
4. **Slices for scale** - Split large stores into composable slices
5. **Select specific fields** - Subscribe to minimal state to prevent re-renders
6. **TypeScript** - Always type your store: `create<Store>()`

## Middleware

```typescript
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useStore = create<Store>()(
  devtools(
    persist(
      immer((set) => ({ ... })),
      { name: 'storage-key' }
    ),
    { name: 'StoreName' }
  )
)
```

## File Structure

```
src/
├── stores/
│   ├── index.ts          # Main store combining slices
│   └── slices/
│       ├── bearSlice.ts
│       └── userSlice.ts
```

For Svelte:

```
src/
├── stores/
│   ├── bearStore.ts      # Vanilla zustand + svelte readable
│   └── index.ts          # Export all stores
```
