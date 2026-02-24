# GitHub Actions CI Implementation Plan

## Overview

Add **GitHub Actions** CI workflow to automate linting, testing, and building.

## Why GitHub Actions?

- Built into GitHub
- Matrix builds for parallel testing
- Free for public repos

---

## Implementation

### 1. Create Workflow

```
.github/
└── workflows/
    └── ci.yml
```

### 2. CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

---

## Optional Enhancements

### Typecheck Job

```yaml
typecheck:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm turbo run typecheck
```

### Matrix Testing

```yaml
test:
  strategy:
    matrix:
      node-version: [20, 22, 23]
```

### PR Title Check

```yaml
- uses: amannn/action-semantic-pull-request@v5
```

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'pnpm'
    directory: '/'
    schedule:
      interval: 'weekly'
```

---

## Validate

Push to a branch and open a PR to verify the workflow runs.

---

## Future Enhancements

- Deployment workflows (Vercel, Netlify)
- Release workflow with changelog
- CodeQL security scanning
