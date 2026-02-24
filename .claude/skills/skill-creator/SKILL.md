---
name: skill-creator
description: Create Claude Code skills following the Agent Skills specification. Use when building custom skills with SKILL.md, scripts/, references/, and assets/ directories. Includes guidance on frontmatter, progressive disclosure, and packaging.
---

# Skill Creator

## Directory Structure

```
skill-name/
├── SKILL.md           # REQUIRED - name + description frontmatter, then markdown
└── Bundled Resources
    ├── scripts/       # Executable code (Python/Bash)
    ├── references/    # Docs loaded as needed
    └── assets/       # Files in output (templates, images)
```

## Frontmatter

YAML frontmatter REQUIRED with `name` and `description`:

```yaml
---
name: brand-guidelines
description: Applies Anthropic brand colors. Use when user needs brand colors, typography, or design standards for artifacts.
---
```

**Description is the trigger** - include BOTH what it does AND when to use it.

## SKILL.md Guidelines

- Keep under 500 lines
- Use imperative/infinitive form
- Progressive disclosure: core in body, details in references
- No README, CHANGELOG, or extra docs

## Creation Steps

1. Create directory: `mkdir .claude/skills/<name>`
2. Write SKILL.md with frontmatter
3. Add scripts/, references/, assets/ as needed
4. Test scripts by running them
5. Package if distributing

## Workflow Patterns

Sequential:

```markdown
1. Step one
2. Step two
3. Step three
```

Conditional:

```markdown
1. Determine type:
   **Creating new?** → Follow "Creation workflow"
   **Editing?** → Follow "Editing workflow"
```

## Output Patterns

Template (strict):

```markdown
## Structure

ALWAYS use:

# Title

## Summary

[One paragraph]

## Details

- Point 1
```

Examples (flexible):

```markdown
## Format

Follow these examples:
Input: Added login
Output: feat(auth): implement login
```
