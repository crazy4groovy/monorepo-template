# Workflow Patterns

## Sequential Workflow

For fixed multi-step processes:

```markdown
## Process

1. Analyze input (run analyze.py)
2. Transform data (run transform.py)
3. Validate output (run validate.py)
4. Generate report (see templates/report.md)
```

## Conditional Workflow

For branching based on input type:

```markdown
## Determining Approach

1. Check input type:
   **.pdf?** → Follow "PDF workflow"
   **.docx?** → Follow "Word workflow"
   **.xlsx?** → Follow "Excel workflow"

2. PDF workflow:
   - Load with pdfplumber
   - Extract text
   - Return formatted output

3. Word workflow:
   - Load with python-docx
   - Preserve formatting
   - Return structured data
```

## Parallel Execution

When steps are independent:

```markdown
## Parallel Tasks

Run these concurrently:

- Generate charts (scripts/chart.py)
- Compile statistics (scripts/stats.py)
- Build summary (scripts/summary.py)

Then combine in final output.
```

## Error Handling

```markdown
## Error Recovery

1. On validation failure → Show error, ask user to fix
2. On script failure → Log error, try fallback approach
3. On timeout → Retry once, then fail gracefully
```
