---
name: monorepo-workflow
description: Monorepo-specific workflow (pnpm workspaces, Turborepo, shared packages, git). Use when working with workspace dependencies or commits.
---

# Monorepo Workflow

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
├── turbo.json              # Turborepo pipeline config
└── pnpm-workspace.yaml     # pnpm workspace config
```

## Prerequisites

- Node.js >=22.0.0
- pnpm >=8.0.0
- Run `pnpm install` to install all workspace dependencies

## Workspace Names

Use with turbo filters: `react-app`, `svelte-app`, `astro-app`, `express-service`, `package1`, `firebase-auth`

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
pnpm build    # Build all
pnpm dev      # Dev mode all
pnpm watch    # Dev mode with file watching
pnpm test     # Run all tests
pnpm lint     # Lint all
pnpm format   # Format all
pnpm knip     # Dead code detection

# Targeted (fast inner loop)
pnpm turbo run test --filter <workspace-name>
cd <workspace> && pnpm knip
```

## Troubleshooting

- **Tests failing**: Run `pnpm install`
- **Import errors**: Verify workspace dependencies in `package.json`
