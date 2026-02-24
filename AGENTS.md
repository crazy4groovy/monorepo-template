# AGENTS.md

This file provides context and instructions for AI coding agents working on this monorepo project. Your role is to build, validate, and ship autonomously.

## Project Overview

Monorepo using pnpm workspaces and Turborepo v2:

- **Apps**: React, Svelte, Astro
- **Services**: Express API
- **Packages**: Shared utility (`package1`)

All projects use TypeScript. Prettier config at root (`.prettierrc`). ESLint rules are unique per project.

**Prerequisites**: Node.js >=22.0.0, pnpm >=8.0.0. Run `pnpm install` to install all workspace dependencies.

## Agentic Workflow

Every change must go through a validation loop. Do not make large changes without self-validating along the way — largely without waiting for human review of intermediate steps.

## Validation Loop (Use red/green TDD)

For every feature, fix, or refactor:

1. **Clarify outcome** — Understand what "done" looks like. State assumptions if requirements are ambiguous. Prefer to ask clarifying question.
2. **Write tests first** — Add tests that fail without the change.
3. **Implement** — Write minimal code to satisfy requirements and make tests pass.
4. **Validate** — Run checks from the workspace you modified:
   ```bash
   pnpm test && pnpm lint && pnpm build
   ```
   For cross-workspace or shared package changes, run from root.
5. **Iterate** — Fix failures and re-run. If code becomes messy, revert and try a different approach.

## Testing Requirements

- Write tests before implementing features
- Write tests that reproduce bugs before fixing them
- Run `pnpm test` before committing
- Run targeted tests for fast feedback:
  ```bash
  pnpm turbo run test --filter <workspace-name>
  ```

## Linting Requirements

- Run `pnpm lint` before committing
- Fix all linting errors before merging

## Code Style

- Use Prettier for formatting (configured at root). Key settings that affect how you write code:
  - **No semicolons** (`semi: false`)
  - **Single quotes** (`singleQuote: true`)
  - **100 char print width** (`printWidth: 100`)
  - **Trailing commas ES5** (`trailingComma: "es5"`)
  - **LF line endings** (`endOfLine: "lf"`)
- Use TypeScript with strict mode
- Avoid `any` types
- Use functional patterns, camelCase/PascalCase naming
- Group imports (external, internal, relative)

## Before Committing

```bash
pnpm format:check && pnpm lint && pnpm test
```

## README.llm.md Maintenance

Each `src` subfolder contains a `README.llm.md` file documenting modules, classes, exported functions, components, and relationships.

**Update README.llm.md when you**:

- Add, modify, or remove modules/classes/functions
- Change relationships between modules
- Update type definitions or interfaces

**What to include**: subfolder purpose, list of modules and their exports, relationships and dependencies between modules, usage examples where helpful. Use absolute paths from project root (e.g., `apps/react-app/src/App.tsx`). Only make edits with substantial information changes — update child folders before parent folders.

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

Use these with turbo filters: `react-app`, `svelte-app`, `astro-app`, `express-service`, `package1`, `firebase-auth`

## Key Principles

- **Tests are the gate** — If tests pass, the change is likely correct
- **Small, incremental steps** — Validate after each piece
- **Outcome over implementation** — Prefer simple, readable solutions
- **Revert rather than patch** — Don't pile fixes on broken foundations
- **Run checks proactively** — Don't wait for a human to tell you something is broken
- **Iterate in conversation** — For complex tasks, clarify architecture and acceptance criteria with the user before generating code; refine incrementally rather than one-shotting

## Shared Packages

Changes to `packages/package1` affect all dependents:

1. Make changes in `packages/package1/src`
2. Validate the package: `pnpm build && pnpm test`
3. Validate dependents from root: `pnpm test && pnpm lint`

## Git Strategy

- Commit after each logical step passes validation
- Write meaningful messages (what changed, not how)
- Tests gate every commit
- Never commit code that fails `pnpm test` or `pnpm lint`

## Common Commands

```bash
# Root (all workspaces)
pnpm build                  # Build all
pnpm dev                    # Dev mode all
pnpm watch                  # Dev mode with file watching
pnpm test                   # Run all tests
pnpm lint                   # Lint all
pnpm format                 # Format all
pnpm knip                   # Dead code detection

# Targeted (fast inner loop)
pnpm turbo run test --filter <workspace-name>   # Test one workspace
cd <workspace> && pnpm vitest run -t "<name>"   # Run single test by name
cd <workspace> && pnpm test:watch               # Tests in watch mode
cd <workspace> && pnpm knip                     # Dead code in one workspace
```

## Troubleshooting

- **Prettier not working**: Reload VS Code window
- **Tests failing**: Run `pnpm install`
- **Build errors**: Run `pnpm build` to check TypeScript
- **Import errors**: Verify workspace dependencies in `package.json`
