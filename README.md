# Mono Template

A comprehensive monorepo template using pnpm workspaces and Turborepo v2 for managing multiple applications, services, and shared packages. Includes React, Svelte, and Astro apps with full testing, linting, and code quality tooling.

See also @AGENTS.md for more AI agent specific instructions.

## Prerequisites

- **Node.js**: >=24.0.0
- **pnpm**: >=8.0.0

## Installation

Install dependencies for all workspaces:

```bash
pnpm install
```

## Project Structure

```
mono-template/
├── apps/
│   ├── react-app/          # React application (Vite + TypeScript + React Testing Library)
│   ├── svelte-app/         # Svelte application (Vite + TypeScript + Svelte Testing Library)
│   └── astro-app/          # Astro application (Astro + React + TypeScript + Testing Library)
├── packages/
│   └── package1/           # Shared utility package (TypeScript)
├── services/
│   └── express-service/    # Express API service (TypeScript + Express)
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── turbo.json              # Turborepo pipeline configuration
└── mono-template.code-workspace  # VS Code workspace file
```

## Available Scripts

### Root Level

Run from the root directory to execute across all workspaces:

- `pnpm build` - Build all packages and applications
- `pnpm dev` - Start development mode for all applications
- `pnpm watch` - Start development mode with file watching (recommended for instant package updates)
- `pnpm lint` - Run linting across all workspaces
- `pnpm lint:fix` - Auto-fix linting issues across all workspaces
- `pnpm test` - Run tests across all workspaces
- `pnpm knip` - Run code quality checks (unused dependencies, dead code, etc.)

### Individual Workspaces

Each workspace supports the following commands:

#### React App (`apps/react-app`)

```bash
cd apps/react-app
pnpm dev          # Start Vite dev server (default: http://localhost:5173)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix      # Auto-fix ESLint issues
pnpm test         # Run Vitest tests
pnpm test:watch    # Run Vitest in watch mode
pnpm knip         # Check for unused code/dependencies
```

#### Svelte App (`apps/svelte-app`)

```bash
cd apps/svelte-app
pnpm dev          # Start Vite dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint (supports .svelte files)
pnpm lint:fix      # Auto-fix ESLint issues
pnpm test         # Run Vitest tests
pnpm test:watch    # Run Vitest in watch mode
pnpm knip         # Check for unused code/dependencies
```

#### Astro App (`apps/astro-app`)

```bash
cd apps/astro-app
pnpm dev          # Start Astro dev server (default: http://localhost:4321)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint (supports .astro files)
pnpm lint:fix      # Auto-fix ESLint issues
pnpm test         # Run Vitest tests (for React components)
pnpm test:watch    # Run Vitest in watch mode
pnpm knip         # Check for unused code/dependencies
```

#### Express Service (`services/express-service`)

```bash
cd services/express-service
pnpm dev          # Start with hot reload (tsx watch)
pnpm build        # Compile TypeScript to JavaScript
pnpm start        # Run compiled JavaScript (requires build first)
pnpm lint         # Run ESLint
pnpm lint:fix      # Auto-fix ESLint issues
pnpm typecheck     # Type check without emitting files
pnpm test         # Run Vitest tests
pnpm test:watch    # Run Vitest in watch mode
pnpm knip         # Check for unused code/dependencies
```

#### Package1 (`packages/package1`)

```bash
cd packages/package1
pnpm build        # Compile TypeScript
pnpm dev          # Watch mode compilation
pnpm lint         # Run ESLint
pnpm lint:fix      # Auto-fix ESLint issues
pnpm typecheck     # Type check without emitting files
pnpm test         # Run Vitest tests
pnpm test:watch    # Run Vitest in watch mode
pnpm knip         # Check for unused code/dependencies
```

## Configuration Details

### ESLint

All projects use ESLint with TypeScript support:

- **React App**: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Svelte App**: `eslint-plugin-svelte`, `svelte-eslint-parser`
- **Astro App**: `eslint-plugin-astro`, `astro-eslint-parser`
- **Express Service & Package1**: Standard TypeScript ESLint

**Common Rules:**

- Import order enforcement (`sort-imports`)
- Consistent type imports (`@typescript-eslint/consistent-type-imports`)
- React/JSX best practices (for React apps)
- All projects use `--max-warnings 0` for strict linting

### Testing

All projects use Vitest with consistent configuration:

- **Mock Cleanup**: `mockReset`, `restoreMocks`, `clearMocks` enabled
- **Testing Library**:
  - React apps: `@testing-library/react` + `@testing-library/jest-dom`
  - Svelte app: `@testing-library/svelte` + `@testing-library/jest-dom`
  - Express service: `vitest` + `supertest` for API testing
- **Test Setup Files**: Located in `src/test/setup.ts` for each project
- **Test ID Attribute**: Configured to use `data-test-id`

### Code Quality (Knip)

All projects have Knip configured to detect:

- Unused dependencies
- Unused exports
- Unresolved imports
- Dead code

Configuration files: `knip.config.ts` in each project root.

### Environment Variables

Each project has a `.env.sample` file with example environment variables:

- **React/Svelte Apps**: Use `VITE_` prefix for client-accessible variables
- **Astro App**: Use `PUBLIC_` prefix for client-accessible variables
- **Express Service**: Standard `.env` file (loaded via `dotenv/config`)
- **Package1**: `.env` file for test environment variables

**Setup:**

1. Copy `.env.sample` to `.env` in each project
2. Update values as needed
3. `.env` files are gitignored

### TypeScript

All projects use strict TypeScript configuration:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

## Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Set up environment variables**: Copy `.env.sample` to `.env` in each project
3. **Start development**: `pnpm watch` (recommended for instant package updates) or `pnpm dev`
4. **Run checks**:
   - `pnpm lint` / `pnpm lint:fix` - Linting
   - `pnpm test` - Tests
   - `pnpm knip` - Code quality
5. **Build**: `pnpm build` (Turborepo handles dependency order automatically)

## Workspace Dependencies

The monorepo uses pnpm workspaces for dependency management. Shared packages are referenced using the `workspace:*` protocol:

- `apps/react-app` depends on `package1`
- `apps/svelte-app` depends on `package1`
- `apps/astro-app` depends on `package1`
- `services/express-service` depends on `package1`

When you make changes to `package1`:

- **In development** (`pnpm watch`): Changes are instantly reflected - no rebuild needed!
- **For production builds**: Run `pnpm build` to compile packages before building dependent apps

### Dependency Version Conventions

This monorepo follows a specific versioning strategy for dependencies:

- **Production dependencies** (`dependencies`): Use tilde (`~`) to allow only patch-level updates
  - Example: `"react": "~19.2.0"` allows `19.2.x` but not `19.3.0` or `20.0.0`
  - This provides stability for production dependencies while still receiving bug fixes

- **Development dependencies** (`devDependencies`): Use caret (`^`) to allow minor and patch updates
  - Example: `"typescript": "^5.9.3"` allows `5.9.x`, `5.10.x`, etc., but not `6.0.0`
  - This allows dev tools to stay current with new features and improvements

**Rationale**: Production dependencies need more stability, while dev dependencies can be more flexible to take advantage of tooling improvements.

## Turborepo

This monorepo uses [Turborepo v2](https://turbo.build/) for:

- **Caching**: Build outputs are cached for faster subsequent builds
- **Parallel execution**: Tasks run in parallel when possible
- **Dependency management**: Automatically handles build order based on workspace dependencies

**Task Dependencies:**

- `build`: Depends on `^build` (builds dependencies first)
- `lint`: Depends on `^build` (ensures code is built before linting)
- `test`: Depends on `^build` (ensures code is built before testing)
- `dev`, `lint:fix`, `knip`: No dependencies (can run independently)

## Technology Stack

- **Package Manager**: pnpm 8.15.0
- **Build System**: Turborepo v2
- **Frontend Apps**:
  - React App: Vite + React 18 + TypeScript + React Testing Library
  - Svelte App: Vite + Svelte 5 + TypeScript + Svelte Testing Library
  - Astro App: Astro 4 + React + TypeScript + React Testing Library
- **Backend Service**: Express + TypeScript + Supertest
- **Shared Package**: TypeScript utilities
- **Testing**: Vitest with consistent mock cleanup across all projects
- **Linting**: ESLint with framework-specific plugins (React, Svelte, Astro)
- **Code Quality**: Knip (unused dependencies, dead code detection)
- **Environment**: dotenv (Node.js) / Vite env vars (frontend apps)

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. **Open in VS Code**: Open `mono-template.code-workspace` to see organized folder structure
4. Copy `.env.sample` to `.env` in each project (see [Environment Variables](#environment-variables))
5. Start development: `pnpm watch` (recommended) or `pnpm dev`
6. Access applications:
   - React app: `http://localhost:5173` (default Vite port)
   - Svelte app: `http://localhost:5173` (or next available port)
   - Astro app: `http://localhost:4321` (default Astro port)
   - Express API: `http://localhost:3000`

## Instant Package Updates in Development

This monorepo is configured for instant hot-reload when workspace packages change. Changes to shared packages are instantly reflected in dependent apps/services without manual rebuilds.

**How it works:**

- Packages export source files via "development" export condition
- Vite apps resolve packages from source using Vite aliases
- Node services use `tsx watch` to monitor workspace package changes
- `pnpm watch` coordinates all dev processes via Turborepo watch mode

### Recommended Development Workflow

Use `pnpm watch` for instant package updates. It runs `turbo watch dev`, which monitors all files and automatically restarts dependent services when packages change.

### Setting Up Instant Updates for New Apps/Services

#### For Vite-Based Apps (React, Vue, Svelte, etc.)

1. **Add workspace dependency** to your app's `package.json`:

   ```json
   {
     "dependencies": {
       "package1": "workspace:*"
     }
   }
   ```

2. **Configure Vite** (`vite.config.ts`) to resolve from source:

   ```typescript
   import { defineConfig } from 'vitest/config'
   import path from 'path'

   export default defineConfig({
     resolve: {
       alias: {
         package1:
           process.env.NODE_ENV === 'development'
             ? path.resolve(__dirname, '../../packages/package1/src/index.ts')
             : 'package1',
       },
     },
   })
   ```

3. **Import and use** the package normally:

   ```typescript
   import { capitalize } from 'package1'
   ```

   Changes to `package1` will be instantly reflected in your Vite app!

#### For Astro Apps

1. **Add workspace dependency** to your app's `package.json`:

   ```json
   {
     "dependencies": {
       "package1": "workspace:*"
     }
   }
   ```

2. **Configure Astro** (`astro.config.mjs`) to resolve from source:

   ```javascript
   import { defineConfig } from 'astro/config'
   import path from 'path'

   export default defineConfig({
     vite: {
       resolve: {
         alias: {
           package1:
             process.env.NODE_ENV === 'development'
               ? path.resolve(import.meta.dirname, '../../packages/package1/src/index.ts')
               : 'package1',
         },
       },
     },
   })
   ```

#### For Node.js/Express Services

1. **Add workspace dependency** to your service's `package.json`:

   ```json
   {
     "dependencies": {
       "package1": "workspace:*"
     }
   }
   ```

2. **Configure dev script** to watch workspace packages:

   ```json
   {
     "scripts": {
       "dev": "tsx watch --clear-screen=false --watch ../../packages/package1/src src/index.ts"
     }
   }
   ```

   Replace `../../packages/package1/src` with the relative path to your package's source directory.

3. **Import and use** the package normally:

   ```typescript
   import { capitalize } from 'package1'
   ```

   Changes to `package1` will automatically restart your service!

#### For New Shared Packages

1. **Create package structure**:

   ```
   packages/your-package/
   ├── src/
   │   └── index.ts
   ├── package.json
   └── tsconfig.json
   ```

2. **Configure `package.json`** with development exports:

   ```json
   {
     "name": "your-package",
     "version": "0.1.0",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "development": {
           "types": "./src/index.ts",
           "default": "./src/index.ts"
         },
         "types": "./dist/index.d.ts",
         "default": "./dist/index.js"
       }
     },
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch"
     }
   }
   ```

3. **Update dependent apps/services**:
   - **Vite apps**: Add alias in `vite.config.ts` pointing to `../../packages/your-package/src/index.ts`
   - **Astro apps**: Add alias in `astro.config.mjs` vite.resolve.alias
   - **Node services**: Add `--watch ../../packages/your-package/src` to the tsx watch command

### Troubleshooting

**Changes not reflecting?**

- Use `pnpm watch` (not just `pnpm dev`)
- Verify package `package.json` has "development" export condition
- Check Vite alias paths use absolute paths with `path.resolve`
- For Node services, ensure `--watch` flag includes package source directory

**Type errors in development?**

- Ensure TypeScript project references configured (`tsconfig.json` with `references`)
- Check `composite: true` in package `tsconfig.json`
- Verify module resolution settings

**Build vs Development**

- Production (`pnpm build`): Uses compiled `dist/` files
- Development (`pnpm watch`): Uses source files for instant updates
- Always test production builds before deploying

## Notes for AI Coding Assistants

### General Guidelines

- **Always use `pnpm` commands**, not `npm` or `yarn`
- All TypeScript projects use **strict mode**
- Workspace packages use `workspace:*` for internal dependencies
- Build outputs are in `dist/` directories for packages and services
- Frontend app build outputs are in `apps/*/dist/`
- Turborepo handles task dependencies automatically via `^build` syntax
- For instant updates, use `pnpm watch` instead of `pnpm dev`

### Project-Specific Notes

| Project         | Entry Point            | Test Pattern | Env Prefix    | Config Files                                          |
| --------------- | ---------------------- | ------------ | ------------- | ----------------------------------------------------- |
| React App       | `src/main.tsx`         | `*.test.tsx` | `VITE_`       | `vite.config.ts`, `.eslintrc.cjs`                     |
| Svelte App      | `src/main.ts`          | `*.test.ts`  | `VITE_`       | `vite.config.ts`, `svelte.config.js`, `.eslintrc.cjs` |
| Astro App       | `src/pages/**/*.astro` | `*.test.tsx` | `PUBLIC_`     | `astro.config.mjs`, `.eslintrc.cjs`                   |
| Express Service | `src/index.ts`         | `*.test.ts`  | None (dotenv) | `.eslintrc.cjs`                                       |
| Package1        | `src/index.ts`         | `*.test.ts`  | None (dotenv) | `.eslintrc.cjs`                                       |

**Common Configuration:**

- All projects: `knip.config.ts`, `tsconfig.json`, `.env.sample`
- All apps: `src/test/setup.ts` for test configuration
- All projects: ESLint with TypeScript support

### Common Patterns

#### Adding a New Dependency

```bash
# In a specific workspace
cd apps/react-app
pnpm add <package-name>

# Or from root (recommended)
pnpm --filter react-app add <package-name>
```

#### Running Commands in Specific Workspace

```bash
# From root
pnpm --filter react-app dev
pnpm --filter express-service test
pnpm --filter package1 build

# Or navigate to workspace directory
cd apps/react-app
pnpm dev
```

#### Adding Tests

- Create test files: `*.test.tsx` (React/Astro), `*.test.ts` (Svelte/Node)
- Use Testing Library for component tests
- Use Vitest globals (`describe`, `it`, `expect`)
- Test setup: `src/test/setup.ts`

#### Adding Environment Variables

1. Add to `.env.sample` in the project with documentation
2. Use appropriate prefix (see [Environment Variables](#environment-variables) section)
3. Copy `.env.sample` to `.env` and update values

#### Code Quality Checks

- `pnpm knip` - Find unused code/dependencies (all projects have `knip.config.ts`)
- `pnpm lint` - Check for linting issues
- `pnpm lint:fix` - Auto-fix linting issues

### File Structure Patterns

```
apps/[app-name]/
├── src/
│   ├── pages/          # Astro: file-based routing
│   ├── components/     # React/Svelte/Astro components
│   ├── layouts/        # Astro: layout components
│   ├── test/
│   │   └── setup.ts    # Test configuration
│   ├── *.test.tsx      # Test files
│   └── main.tsx        # Entry point
├── .eslintrc.cjs       # ESLint configuration
├── knip.config.ts      # Knip configuration
├── vite.config.ts      # Vite configuration (or astro.config.mjs for Astro)
├── tsconfig.json        # TypeScript configuration
├── .env.sample          # Environment variables template
└── package.json         # Package configuration
```

### React Code Conventions

#### useProps Pattern

For large React components, use the `useProps` pattern to separate business logic from presentation:

**Pattern:**

- Create a custom hook named `useProps` (or `use[ComponentName]Props`) that contains all non-JSX business logic
- The hook accepts the component's props and returns all data/state/handlers needed for rendering
- The presentation component calls the hook, passing in its props, and destructures the result
- This separation makes business logic easier to unit test independently

**Example:**

```typescript
// Component.tsx - Presentation component
import { useProps } from "./useProps";

interface ComponentProps {
  userId: string;
  onSuccess?: () => void;
}

export default function Component(props: ComponentProps) {
  const { user, isLoading, error, handleSubmit, handleReset } = useProps(props);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

```typescript
// useProps.ts - Business logic hook
import { useState, useEffect } from 'react'

type UsePropsParams = {
  userId: string
  onSuccess?: () => void
}

export function useProps({ userId, onSuccess }: UsePropsParams) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleSubmit = async () => {
    // Business logic here
    await submitData()
    onSuccess?.()
  }

  const handleReset = () => {
    // Reset logic here
    setUser(null)
    setError(null)
  }

  return {
    user,
    isLoading,
    error,
    handleSubmit,
    handleReset,
  }
}
```

**Testing Strategy:**

1. **Unit test `useProps` hook thoroughly** - Test all business logic, state changes, side effects, and edge cases
2. **Integration test the presentation component** - Focus on happy path and critical user flows

```typescript
// useProps.test.ts - Comprehensive unit tests
import { renderHook, waitFor } from '@testing-library/react'
import { useProps } from './useProps'

describe('useProps', () => {
  it('fetches user data on mount', async () => {
    const { result } = renderHook(() => useProps({ userId: '123' }))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.user).toBeDefined()
    })
  })

  it('handles errors correctly', async () => {
    // Test error handling
  })

  it('calls onSuccess callback when submit succeeds', async () => {
    // Test callback invocation
  })
})
```

```typescript
// Component.test.tsx - Happy path integration tests
import { render, screen } from "@testing-library/react";
import Component from "./Component";

describe("Component", () => {
  it("renders user data correctly", async () => {
    render(<Component userId="123" />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  it("calls onSuccess when submit button is clicked", async () => {
    const onSuccess = vi.fn();
    render(<Component userId="123" onSuccess={onSuccess} />);
    // Test user interaction
  });
});
```

**Benefits:**

- **Separation of concerns**: Business logic is isolated from presentation
- **Easier testing**: Hook logic can be tested independently with `renderHook`
- **Reusability**: Hook can be reused in other components if needed
- **Maintainability**: Easier to understand and modify complex components

### Testing Patterns

```typescript
// Component test example
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Component from "./Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Environment Variable Patterns

```typescript
// Vite apps (React, Svelte) - use VITE_ prefix
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Astro apps - use PUBLIC_ prefix
const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

// Node.js services - no prefix, loaded via dotenv
import 'dotenv/config'
const port = process.env.PORT || 3000
```

## Contributing

When adding new features or making changes:

1. Run `pnpm lint` to check for linting issues
2. Run `pnpm lint:fix` to auto-fix issues
3. Run `pnpm test` to ensure tests pass
4. Run `pnpm knip` to check for unused code
5. Run `pnpm build` to ensure production builds work
6. Update this README if adding new apps/services or changing structure
