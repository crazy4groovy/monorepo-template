---
name: context-driven-development
description: Context-Driven Development (CDD) methodology for AI coding agents. Use when managing software features with specs, plans, and tracked implementation phases. Based on Conductor extension patterns: setup project context, create tracks for features/bugs, implement with workflow, review and revert.
---

# Context-Driven Development (CDD)

## Core Philosophy

**Measure twice, code once.** Control your code by treating context as a managed artifact. Transform the repository into a single source of truth that drives every agent interaction.

## Workflow

### 1. Setup Project Context (Run Once)

Define core components that guide all future work:

- **Product**: Users, product goals, high-level features
- **Guidelines**: Prose style, brand messaging, visual identity
- **Tech Stack**: Language, database, frameworks
- **Workflow**: TDD, commit strategy, team preferences

Generated artifacts:

- `conductor/product.md`
- `conductor/product-guidelines.md`
- `conductor/tech-stack.md`
- `conductor/workflow.md`
- `conductor/tracks.md`

### 2. Start a New Track (Feature or Bug)

Create a track - a high-level unit of work with:

- **Spec**: Detailed requirements (what & why)
- **Plan**: Actionable to-do with phases, tasks, sub-tasks

Generated artifacts:

- `conductor/tracks/<track_id>/spec.md`
- `conductor/tracks/<track_id>/plan.md`
- `conductor/tracks/<track_id>/metadata.json`

### 3. Implement the Track

Execute plan tasks sequentially:

1. Select next pending task
2. Follow workflow (e.g., TDD: Test → Fail → Implement → Pass)
3. Update task status in plan
4. Manual verification at phase end

### 4. Review & Revert

- **Review**: Check against guidelines and plan
- **Revert**: Git-aware undo (tracks, phases, tasks, not just commits)

## Track Structure

```
conductor/
├── product.md
├── product-guidelines.md
├── tech-stack.md
├── workflow.md
├── tracks.md
└── tracks/
    └── <track_id>/
        ├── spec.md
        ├── plan.md
        └── metadata.json
```

## Spec Template

```markdown
# Feature: <name>

## Problem

What problem does this solve?

## Goals

- Goal 1
- Goal 2

## Non-Goals

- What we're NOT doing

## Success Criteria

- Criterion 1
```

## Plan Template

```markdown
# Plan: <track_id>

## Phase 1: <name>

- [ ] Task 1
- [ ] Task 2

## Phase 2: <name>

- [ ] Task 3

## Verification

Steps to verify completion
```

## Commands

| Command     | Description                |
| ----------- | -------------------------- |
| `setup`     | Scaffold project context   |
| `newTrack`  | Start feature/bug track    |
| `implement` | Execute current track plan |
| `status`    | Show progress              |
| `review`    | Review against guidelines  |
| `revert`    | Undo track/phase/task      |

## Key Principles

1. **Spec first**: Define before implementing
2. **Plan approval**: Review plans before code
3. **Phase verification**: Manual check after each phase
4. **Context persistence**: Shared foundation for team
5. **Logical revert**: Undo by logical units, not commits
