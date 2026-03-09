# AGENTS.md

This file provides context and instructions for AI coding agents working on this monorepo project.

## Project Overview

Monorepo using pnpm workspaces and Turborepo v2:

- **Apps**: React, Svelte, Astro
- **Services**: Express API
- **Packages**: Shared utility (`package1`)

All projects use TypeScript with per-project ESLint rules.

## Skills

This project uses skills for detailed workflows:

- **validation-loop**: TDD/red-green validation for all code changes
- **code-standards**: Prettier, TypeScript, and linting requirements
- **monorepo-workflow**: pnpm workspaces, Turborepo, shared packages, git strategy

Load skills using the Skill tool when working on related tasks.

## README.llm.md Maintenance

Each `src` subfolder contains a `README.llm.md` documenting modules, classes, exports, and relationships. Update when adding/modifying/removing modules or changing dependencies.

## Custom Slash Commands

This project defines custom slash commands in `.claude/commands/` or `.opencode/commands/`. Use the Task tool with `subagent_type: "general"` to invoke them.

## Before Committing

```bash
pnpm format:check && pnpm lint && pnpm test
```
