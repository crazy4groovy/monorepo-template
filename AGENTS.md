# AGENTS.md

This file provides context and instructions for AI coding agents working on this monorepo project.

## Project Overview

This is a monorepo template using pnpm workspaces and Turborepo v2. It contains:

- **Apps**: React app, Svelte app, and Astro app
- **Services**: Express API service
- **Packages**: Shared utility package (`package1`)

All projects use TypeScript and share a common Prettier configuration. Eslint rules are unique per project.

## Setup Commands

### Initial Setup

```bash
# Install all dependencies for all workspaces
pnpm install
```

### Prerequisites

- **Node.js**: >=24.0.0
- **pnpm**: >=8.0.0

## Build Commands

### Root Level (All Workspaces)

```bash
# Build all packages and applications
pnpm build

# Start development mode for all applications
pnpm dev

# Start development mode with file watching (recommended for package updates)
pnpm watch
```

### Individual Workspaces

```bash
# React App
cd apps/react-app
pnpm build

# Svelte App
cd apps/svelte-app
pnpm build

# Astro App
cd apps/astro-app
pnpm build

# Express Service
cd services/express-service
pnpm build

# Shared Package
cd packages/package1
pnpm build
```

## Testing Instructions

### Run All Tests

```bash
# From root - run tests for all workspaces
pnpm test
```

### Run Tests for Specific Workspace

```bash
# Using turbo filter
pnpm turbo run test --filter <workspace-name>

# Or from workspace directory
cd apps/react-app
pnpm test
```

### Run Tests in Watch Mode

```bash
cd <workspace-directory>
pnpm test:watch
```

### Run Specific Test

```bash
cd <workspace-directory>
pnpm vitest run -t "<test name>"
```

### Testing Requirements

- **Always run tests before committing**: `pnpm test`
- **Add or update tests** for any code changes, even if not explicitly requested
- **Ensure all tests pass** before merging changes
- **Resolve any test or type errors** until the entire suite passes

## Code Style Guidelines

### Formatting

- **Use Prettier** for all code formatting
- **Format on save** is enabled in VS Code workspace settings
- **Shared config**: `.prettierrc` at root applies to all workspaces

### Prettier Configuration

- **Semicolons**: Disabled (`semi: false`)
- **Quotes**: Single quotes (`singleQuote: true`)
- **Print width**: 100 characters (`printWidth: 100`)
- **Tab width**: 2 spaces (`tabWidth: 2`)
- **Use tabs**: Disabled (`useTabs: false`)
- **Trailing commas**: ES5 style (`trailingComma: "es5"`)
- **Arrow parens**: Always (`arrowParens: "always"`)
- **End of line**: LF (`endOfLine: "lf"`)
- **Plugins**: Includes `prettier-plugin-astro` and `prettier-plugin-svelte` for framework-specific formatting
- **Overrides**: Custom parsers for `.astro` and `.svelte` files

### Format Commands

```bash
# Format all files
pnpm format

# Check formatting without making changes
pnpm format:check

# Format from any subproject
cd apps/react-app
pnpm format
```

### TypeScript

- **Strict mode**: Enabled in all `tsconfig.json` files
- **Use TypeScript** for all new code
- **Type everything**: Avoid `any` types when possible

### Code Conventions

- **Functional programming**: Prefer functional patterns where appropriate
- **Consistent naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Import organization**: Group imports (external, internal, relative)

## Documentation Guidelines

### README.llm.md Files

Each `src` subfolder contains a `README.llm.md` file that documents all modules, classes, exported functions (names, args, return types), components, and gotchas within that subfolder. These files serve as AI-readable documentation to help coding agents understand the codebase structure and functionality.

#### Location and Structure

- **Location**: `README.llm.md` files exist in every `src` subfolder (e.g., `apps/react-app/src/components/README.llm.md`, `packages/package1/src/utils/README.llm.md`)
- **Purpose**: Describe all modules, classes, exported functions (names, args, return types), components, gotchas, and their important relationships within that subfolder
- **Format**: Markdown format optimized for AI agents to parse and understand
- **File Paths**: All module filepaths referenced in `README.llm.md` files must be absolute from the project root (e.g., `apps/react-app/src/App.tsx`, not `./App.tsx` or `App.tsx`)

#### Maintenance Requirements

- **Update on changes**: Whenever you modify, add, or remove modules/classes in a subfolder, you **must** update the corresponding `README.llm.md` file
- **Keep documentation fresh**: The `README.llm.md` files should accurately reflect the current state of the code in that subfolder
- **Include all exports**: Document all exported functions, classes, components, types, and interfaces
- **Describe relationships**: Explain how modules interact with each other and their dependencies
- **Minimize commit churn**: Only make edits with substantial information changes - do not make minor changes to grammar, word order, etc. to minimize commit changes.

#### When to Update

Update `README.llm.md` files when:

- Adding new modules, classes, or functions to a subfolder
- Modifying existing exported functions (signatures, behavior, or purpose)
- Removing modules or functions
- Changing important relationships between modules
- Updating type definitions or interfaces

#### Example Structure

A `README.llm.md` file should include:

- Overview of the subfolder's purpose
- List of all modules/files in the subfolder
- Description of each module's exports
- Relationships and dependencies (important) between modules and major libs
- Simple usage examples where helpful

## Linting Instructions

### Run Linting

```bash
# Lint all workspaces
pnpm lint

# Lint specific workspace
pnpm turbo run lint --filter <workspace-name>

# Or from workspace directory
cd apps/react-app
pnpm lint
```

### Fix Linting Issues

```bash
# Auto-fix all workspaces
pnpm lint:fix

# Auto-fix specific workspace
cd apps/react-app
pnpm lint:fix
```

### Linting Requirements

- **Always run linting** before committing: `pnpm lint`
- **Fix all linting errors** before merging changes
- **Run linting after modifying files or imports**: `pnpm lint --filter <project_name>`

## Project Structure

```
mono-template/
├── apps/
│   ├── react-app/          # React + Vite + TypeScript
│   ├── svelte-app/         # Svelte + Vite + TypeScript
│   └── astro-app/          # Astro + React + TypeScript
├── packages/
│   └── package1/           # Shared utilities (TypeScript)
├── services/
│   └── express-service/    # Express API (TypeScript)
├── .prettierrc             # Shared Prettier config
├── .prettierignore         # Prettier ignore patterns
├── turbo.json              # Turborepo pipeline config
└── pnpm-workspace.yaml     # pnpm workspace config
```

## Workspace Names

When using turbo filters, use these workspace names:

- `react-app` - React application
- `svelte-app` - Svelte application
- `astro-app` - Astro application
- `express-service` - Express API service
- `package1` - Shared utility package

## Code Quality Checks

### Knip (Dead Code Detection)

```bash
# Check all workspaces
pnpm knip

# Check specific workspace
cd apps/react-app
pnpm knip
```

## Important Notes

1. **Always work from the correct directory**: Use `cd` to navigate to the workspace you're modifying
2. **Shared packages**: Changes to `packages/package1` may affect multiple apps - test accordingly
3. **Type checking**: Run `pnpm typecheck` in workspaces that support it before committing
4. **Prettier config**: The root `.prettierrc` is automatically discovered by Prettier when formatting files
5. **VS Code integration**: Format on save is configured - files will auto-format using the shared Prettier config
6. **Documentation maintenance**: Update `README.llm.md` files in `src` subfolders whenever you modify modules, classes, or functions in that subfolder - modify in order from child folder to parent folder, for help with accurate context and minimizing assumptions.

## Common Workflows

### Making Changes to a Shared Package

```bash
# 1. Make changes to packages/package1/src
# 2. Build the package
cd packages/package1
pnpm build

# 3. Test the package
pnpm test

# 4. Test dependent apps
cd ../../apps/react-app
pnpm test
```

### Adding a New Feature to an App

```bash
# 1. Navigate to app directory
cd apps/react-app

# 2. Make code changes
# 3. Format code
pnpm format

# 4. Run linting
pnpm lint

# 5. Run tests
pnpm test

# 6. Build to verify
pnpm build
```

### Before Committing

Always run these commands before committing:

```bash
# From root
pnpm format:check    # Verify formatting
pnpm lint            # Check linting
pnpm test            # Run all tests
```

**Also ensure**:

- All `README.llm.md` files in modified `src` subfolders are updated to reflect code changes
- Documentation accurately describes the current state of modules and their exports

## Troubleshooting

- **Prettier not working in VS Code**: Reload window (`Ctrl+Shift+P` → "Developer: Reload Window")
- **Tests failing**: Check that dependencies are installed (`pnpm install`)
- **Build errors**: Ensure TypeScript compiles (`pnpm build` from root)
- **Import errors**: Verify workspace dependencies in `package.json` files
