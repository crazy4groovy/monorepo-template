---
name: claude-code-commands
description: Complete reference for Claude Code and OpenCode CLI, built-in slash commands, keyboard shortcuts, and flags. Use for efficient Claude Code workflow, session management, and automation.
---

# Claude Code Commands

## Start Claude Code

```bash
claude                    # Interactive mode
claude "Fix auth bug"     # With initial prompt
claude -p "Analyze code" # One-time query, no session
claude -c                # Continue last session
claude -r "<session-id>" # Resume specific session
```

---

# INVOKED MANUALLY (type `/command`)

## Built-in Slash Commands

These are built into Claude Code - type `/` to invoke:

| Command        | Description                       |
| -------------- | --------------------------------- |
| `/clear`       | Clear conversation, start fresh   |
| `/compact`     | Compress conversation context     |
| `/model`       | Switch model (opus/sonnet/haiku)  |
| `/plan`        | Enter plan mode                   |
| `/context`     | Visualize context usage           |
| `/cost`        | Show token usage & cost           |
| `/status`      | Version, model, account info      |
| `/doctor`      | Check installation health         |
| `/help`        | Show all slash commands           |
| `/exit`        | Exit REPL                         |
| `/export`      | Export conversation               |
| `/init`        | Initialize project with CLAUDE.md |
| `/memory`      | Edit CLAUDE.md memory             |
| `/permissions` | Manage tool permissions           |
| `/tasks`       | Show background tasks             |
| `/todos`       | List TODO entries                 |
| `/theme`       | Change color theme                |
| `/vim`         | Activate Vim mode                 |
| `/mcp`         | Manage MCP servers                |

## Custom Slash Commands (Manual)

Create your own commands in `.claude/commands/` - invoke with `/command-name`.

```markdown
---
description: 'Run tests'
allowed-tools:
  - 'Bash(npm test *)'
---

Run: npm test $ARGUMENTS
```

**Key difference from Skills**: You must type `/command` to invoke. Good for atomic actions you want explicit control over.

---

# INVOKED AUTOMATICALLY (by description)

## Skills (Automatic)

Skills are loaded **automatically** when Claude decides your task matches their description. You don't type anything to invoke them.

Location:

- **Project**: `.claude/skills/<name>/SKILL.md`
- **Personal**: `~/.claude/skills/<name>/SKILL.md`

```yaml
---
name: test-all
description: Runs test suite and linters. Use for CI checks before commits.
model: sonnet
---
Run: npm test $ARGUMENTS
```

### Structure

```
.claude/skills/
├── SKILL.md              # Required
├── scripts/              # Executable code (optional)
├── references/          # Docs loaded on demand (optional)
└── assets/              # Files in output (optional)
```

### Variable Placeholders

| Placeholder  | Description          |
| ------------ | -------------------- |
| `$ARGUMENTS` | All arguments passed |
| `$1`, `$2`   | Positional arguments |
| `@file`      | File reference       |
| `!`command`` | Bash output embed    |

### Frontmatter Fields

| Field           | Description                          |
| --------------- | ------------------------------------ |
| `name`          | Command name                         |
| `description`   | **When to auto-trigger** - critical! |
| `model`         | Model to use                         |
| `allowed-tools` | Restrict tools                       |

### When Skills Trigger

Claude reads skill descriptions at session start. When your task matches a description, the skill loads automatically.

Example triggers:

- "Runs test suite" → triggers when you ask about testing
- "API security" → triggers when you work on APIs

---

# KEYBOARD SHORTCUTS

### General

| Shortcut | Action                   |
| -------- | ------------------------ |
| `Ctrl+C` | Cancel input             |
| `Ctrl+D` | End session              |
| `Ctrl+G` | Open in external editor  |
| `Ctrl+L` | Clear terminal           |
| `Ctrl+R` | Reverse history search   |
| `Ctrl+T` | Toggle task list         |
| `Cmd+T`  | Toggle Extended Thinking |
| `Cmd+P`  | Model picker             |

### Multi-line Input

- `\` + `Enter` - Quick escape
- `Option+Enter` - macOS
- `Shift+Enter` - After `/terminal-setup`

### Quick Prefixes

- `#` at start - Add to CLAUDE.md (memory)
- `/` at start - Execute slash command
- `!` at start - Bash mode
- `@` - File path autocomplete

---

# CLI FLAGS

### Basic

```bash
-p, --print         # Print response, no interactive
-c, --continue      # Continue last session
-r, --resume        # Resume session by ID
```

### Model & System

```bash
--model sonnet
--system-prompt "You are..."
--tools "Bash,Read,Edit"
```

### Permissions

```bash
--allowedTools "Bash(git:*)"
--permission-mode plan
--dangerously-skip-permissions  # Caution!
```

### Debug

```bash
--verbose
--debug "api,mcp"
--max-budget-usd 5.00
```

---

# OPENCODE COMMANDS

OpenCode has a similar command system - invoke manually with `/command`.

| Feature         | Claude Code         | OpenCode              |
| --------------- | ------------------- | --------------------- |
| Manual commands | `.claude/commands/` | `.opencode/commands/` |
| Auto skills     | `.claude/skills/`   | (not supported)       |

Syntax is identical: `$ARGUMENTS`, `!`command``, `@file` work the same.

See [OpenCode Commands](https://opencode.ai/docs/commands/) for details.

---

# DEBUG

```bash
/status
/doctor
/context
/cost
```

---

# TIPS

- **Skills** = automatic (by description match)
- **Slash Commands** = manual (type `/command`)
- Use Skills for domain expertise, Slash Commands for quick actions
- Start in project root, not home directory
- Use `/clear` to reset context when near limits
