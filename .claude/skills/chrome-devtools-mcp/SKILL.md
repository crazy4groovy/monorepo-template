---
name: chrome-devtools-mcp
description: Browser automation and debugging via Chrome DevTools MCP. Use for web scraping, automated testing, UI verification, and debugging. Tools include navigation, input, screenshots, console access, network inspection, and performance profiling.
---

# Chrome DevTools MCP

## Setup

See: https://github.com/ChromeDevTools/chrome-devtools-mcp/?tab=readme-ov-file#getting-started

Install via npm:

```bash
npm install -g @chromedevtools/mcp-server
```

Install via [Claude Code](https://code.claude.com/docs/en/mcp):

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

Configure in Claude Code settings with Chrome remote debugging port (default 9222).

## Core Tools (Slim)

For basic automation:

- `navigate` - Load a URL
- `evaluate` - Run JavaScript on page
- `screenshot` - Take screenshot

## Full Tools

### Navigation

- `navigate_page` - Navigate to URL, back/forward, reload
- `new_page` - Open new page/tab
- `close_page` - Close page by ID
- `list_pages` - List all open pages
- `select_page` - Switch active page
- `wait_for` - Wait for text to appear

### Input Automation

- `click` - Click element by UID
- `type_text` - Type into focused input
- `fill` - Fill input/select by UID
- `fill_form` - Fill multiple form elements
- `hover` - Hover element
- `drag` - Drag element to another
- `press_key` - Press keyboard shortcut
- `upload_file` - Upload file to input
- `handle_dialog` - Accept/dismiss browser dialog

### Debugging

- `take_screenshot` - Capture page/element screenshot
- `take_snapshot` - Get page structure (a11y tree with UIDs)
- `evaluate_script` - Run JS, return JSON
- `list_console_messages` - Get console logs
- `get_console_message` - Get specific console message

### Network

- `list_network_requests` - List all requests since navigation
- `get_network_request` - Get request/response details

### Performance

- `performance_start_trace` - Start performance trace
- `performance_stop_trace` - Stop and save trace
- `performance_analyze_insight` - Analyze trace insights
- `take_memory_snapshot` - Capture heap snapshot

### Emulation

- `emulate` - Set dark/light mode, CPU throttling, geolocation, network conditions, user agent, viewport
- `resize_page` - Resize viewport

## Workflow

1. **Navigate**: `navigate_page` to target URL
2. **Inspect**: `take_snapshot` to get page structure with UIDs
3. **Interact**: Use UIDs with `click`, `fill`, etc.
4. **Verify**: `screenshot` or `evaluate_script` to check results
5. **Debug**: `list_console_messages` for errors

## Element Selection

Always use `take_snapshot` first to get element UIDs, then reference them:

```javascript
// Get snapshot - returns elements with uid properties
take_snapshot()

// Click element by UID from snapshot
click({ uid: 'uid-123' })

// Fill form element
fill({ uid: 'uid-456', value: 'test@example.com' })
```

## Common Patterns

### Form Submission

```
1. navigate_page({ url: "https://example.com/login" })
2. take_snapshot()
3. fill({ uid: "<email-input-uid>", value: "user@test.com" })
4. fill({ uid: "<password-input-uid>", value: "password" })
5. click({ uid: "<submit-button-uid>" })
6. wait_for({ text: ["Welcome", "Dashboard"] })
```

### Debug JS Errors

```
1. list_console_messages()
2. evaluate_script({
    script: "() => window.__ERROR_STATE__"
  })
```

### Network Debugging

```
1. list_network_requests({
    resourceTypes: ["fetch", "xhr"]
  })
2. get_network_request({ reqid: <id> })
```

## Tips

- Use `take_snapshot` over `screenshot` for automation - gives you UIDs to interact with
- Set timeouts for slow pages: `navigate_page({ timeout: 30000 })`
- Use `evaluate_script` for complex interactions JS can't do via CDP
- Check console for JS errors after interactions
- Use `emulate({ networkConditions: "Slow 3G" })` to test on slow networks
