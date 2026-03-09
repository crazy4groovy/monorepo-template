---
name: code-standards
description: Enforces code style standards (Prettier, TypeScript, ESLint). Use when writing or reviewing code to ensure consistency with project conventions.
---

# Code Standards

## Summary

This project uses Prettier for formatting, TypeScript with strict mode, and per-project ESLint rules.

## Prettier Settings

Configured in `.prettierrc` at root. Key settings that affect code:

- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **100 char print width** (`printWidth: 100`)
- **Trailing commas ES5** (`trailingComma: "es5"`)
- **LF line endings** (`endOfLine: "lf"`)

## TypeScript

- Use strict mode
- Avoid `any` types
- Use functional patterns, camelCase/PascalCase naming
- Group imports: external, internal, relative

## Before Committing

```bash
pnpm format:check && pnpm lint && pnpm test
```

## Commands

```bash
pnpm format        # Format all
pnpm format:check # Check formatting
pnpm lint          # Lint all
pnpm build         # Build all (checks TypeScript)
```

## Troubleshooting

- **Prettier not working**: Reload VS Code window
- **Build errors**: Run `pnpm build` to check TypeScript
