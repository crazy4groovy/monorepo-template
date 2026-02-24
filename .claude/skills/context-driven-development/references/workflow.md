# Workflow Template

Default workflow that can be customized per project.

## TDD Workflow

For each task, follow Test-Driven Development:

```markdown
1. Write test (fails)
2. Write minimal code (passes)
3. Refactor
4. Verify
```

## Code Review Checklist

- [ ] Matches spec
- [ ] Follows style guide
- [ ] Tests pass
- [ ] No lint errors
- [ ] Documentation updated

## Commit Strategy

Use conventional commits:

```
feat(scope): description
fix(scope): description
docs(scope): description
test(scope): description
refactor(scope): description
```

## Phase Verification

After each phase:

1. Run tests
2. Manual testing
3. Review changes
4. Get approval to proceed
