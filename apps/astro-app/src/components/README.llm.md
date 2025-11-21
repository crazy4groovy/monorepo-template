# Components

React components used in the Astro application.

## Modules

### `apps/astro-app/src/components/Counter.tsx`

Simple counter component with increment and decrement buttons.

**Exports**:

- `Counter` (default) - React functional component

**Component Props**: None

**State**:

- `count` (number) - Current count value, initialized to 0

**Functions**:

- Increment handler: `() => setCount(count + 1)`
- Decrement handler: `() => setCount(count - 1)`

**Dependencies**:

- `react` - Uses `useState` hook

**Gotchas**:

- Uses React hooks (must be used in React components, not Astro components directly)
- State is local to component instance

### `apps/astro-app/src/components/Counter.test.tsx`

Test file for Counter component.

**Exports**: None (test file)

**Purpose**: Contains Vitest tests for the Counter component

## Relationships

- Components are React components that can be used in Astro pages via `@astrojs/react` integration
- Components use React hooks and patterns, not Astro component patterns
