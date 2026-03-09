---
name: validation-loop
description: Applies TDD/red-green validation loop for features, fixes, and refactors. Use when implementing any code change to ensure test-driven development.
---

# Validation Loop

## Summary

Every code change must go through a validation loop using red/green TDD. Self-validate along the way without waiting for human review.

## Workflow

1. **Clarify outcome** — Understand what "done" looks like. Ask clarifying questions if requirements are ambiguous.
2. **Write tests first** — Add tests that fail without the change.
3. **Implement** — Write minimal code to satisfy requirements and make tests pass.
4. **Validate** — Run checks:
   ```bash
   pnpm test && pnpm lint && pnpm build
   ```
   For cross-workspace or shared package changes, run from root.
5. **Iterate** — Fix failures and re-run. If code becomes messy, revert and try a different approach.

## Guidelines

- **Tests are the gate** — If tests pass, the change is likely correct
- **Small, incremental steps** — Validate after each piece
- **Outcome over implementation** — Prefer simple, readable solutions
- **Revert rather than patch** — Don't pile fixes on broken foundations
- **Run checks proactively** — Don't wait for a human to tell you something is broken
- **Iterate in conversation** — For complex tasks, clarify architecture and acceptance criteria with the user before generating code

## Testing Commands

```bash
# All tests
pnpm test

# Targeted (fast inner loop)
pnpm turbo run test --filter <workspace-name>

# Single test by name
cd <workspace> && pnpm vitest run -t "<name>"

# Watch mode
cd <workspace> && pnpm test:watch
```
