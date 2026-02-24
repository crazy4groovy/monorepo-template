# OpenClaw Feature Prioritization - MVP to Full Product

## My Development Philosophy

Build the **smallest possible thing that delivers value**, then iterate based on feedback. Each phase should produce a working, testable product—not a feature-complete skeleton.

---

## Phase 1: MVP (Weeks 1-4)

### Core Goal: A single-channel AI chat interface

**Rationale**: Establish the fundamental message loop before adding complexity.

| Feature | Description | Priority |
|---------|-------------|----------|
| **WebSocket Gateway** | Local WS server handling message routing, session state, and tool execution | P0 |
| **CLI Entry Point** | `openclaw agent --message "..."` to send prompts and receive responses | P0 |
| **Basic Agent Runtime** | Pi agent in RPC mode with minimal context window | P0 |
| **One Channel (Telegram)** | Proof-of-concept channel with bot token config | P0 |
| **Config System** | JSON-based config at `~/.openclaw/openclaw.json` | P0 |
| **Session Model** | Single `main` session for direct chats | P1 |

**Exit Criteria**: User can configure a Telegram bot, send a message via CLI, receive an AI response back in Telegram.

---

## Phase 2: Multi-Channel Foundation (Weeks 5-8)

### Core Goal: Support the most popular channels

**Rationale**: WhatsApp, Discord, and Slack cover the majority of use cases. Standardize the channel interface early.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Channel Interface** | Abstract `Channel` class with `send`, `receive`, `onMessage` | P0 |
| **WhatsApp (Baileys)** | QR-based authentication, message sending/receiving | P0 |
| **Discord** | Bot token auth, DM and guild message handling | P0 |
| **Slack** | Bot + app token for events and webhooks | P1 |
| **Message Routing** | Route incoming messages to correct session/channel | P0 |
| **Allowlist/Permissions** | Basic `allowFrom` config to control who can message | P1 |

**Exit Criteria**: Bot responds on Telegram, WhatsApp, and Discord from the same codebase.

---

## Phase 3: Tool System (Weeks 9-12)

### Core Goal: Give the agent capabilities beyond text

**Rationale**: The agent needs to do things—run commands, browse the web—to feel useful.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Tool Registry** | Discoverable tools with schemas | P0 |
| **Bash/Shell Tool** | Execute commands, return stdout/stderr | P0 |
| **Read/Write Files** | File system access within workspace | P0 |
| **Browser Tool (Basic)** | Headless Chrome with simple navigation | P1 |
| **HTTP Fetch** | `fetch` tool for API calls | P1 |
| **Tool Streaming** | Stream tool output as it's generated | P2 |

**Exit Criteria**: Agent can run `ls`, `curl`, and read/write files in its workspace.

---

## Phase 4: Session & Context (Weeks 13-16)

### Core Goal: Memory and conversation context

**Rationale**: Users expect the agent to remember context across messages.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Session Persistence** | Save/restore conversation history | P0 |
| **Context Compaction** | Summarize old messages when context fills | P1 |
| **Multiple Sessions** | Separate sessions per user/channel | P1 |
| **Session Pruning** | Auto-cleanup old sessions | P2 |
| **Usage Tracking** | Token usage per session | P2 |

**Exit Criteria**: Agent remembers previous messages in the conversation.

---

## Phase 5: Voice & Multimedia (Weeks 17-20)

### Core Goal: Voice input/output and media handling

**Rationale**: Voice makes the assistant feel more "present" and natural.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Media Pipeline** | Image/audio upload, transcription | P0 |
| **TTS Integration** | Edge TTS for voice responses | P1 |
| **Voice Wake (macOS)** | Hotword detection for hands-free activation | P1 |
| **Talk Mode** | Continuous voice conversation | P2 |
| **Canvas/Visual** | Agent-driven visual workspace | P2 |

**Exit Criteria**: Agent can speak responses and process images.

---

## Phase 6: Advanced Features (Weeks 21+)

### Core Goal: Polish, security, and scale

| Feature | Description | Priority |
|---------|-------------|----------|
| **DM Pairing** | Security: require approval before responding to unknown DMs | P1 |
| **Sandboxing** | Docker-based isolation for group sessions | P1 |
| **Web UI** | Control panel + WebChat via browser | P1 |
| **Cron Jobs** | Scheduled tasks and reminders | P2 |
| **Webhooks** | External event triggers | P2 |
| **Multi-Agent** | Route to different agents per channel | P2 |
| **Skills System** | Extensible agent capabilities | P2 |

---

## Implementation Order Summary

```
Phase 1 (MVP)          Phase 2            Phase 3           Phase 4           Phase 5
┌──────────────┐     ┌───────────┐      ┌───────────┐     ┌───────────┐     ┌───────────┐
│ Gateway WS   │────▶│ Channel   │────▶│ Tool      │────▶│ Session   │────▶│ Voice     │
│ CLI          │     │ Interface │     │ Registry  │     │ Persist   │     │ Media     │
│ Agent RPC    │     │ WhatsApp  │     │ Bash      │     │ Context   │     │ TTS       │
│ Config       │     │ Discord   │     │ Browser   │     │ Multi-    │     │ Canvas    │
│ 1 Channel    │     │ Slack     │     │ Files     │     │ Session   │     │           │
└──────────────┘     └───────────┘      └───────────┘     └───────────┘     └───────────┘
```

---

## Principles Applied

1. **Single Channel First**: Don't build abstraction until you have 2+ implementations
2. **Local Before Remote**: MVP runs locally; Tailscale/remote comes later
3. **Text Before Voice**: Voice adds significant complexity (audio processing, TTS, wake word)
4. **Security From Start**: Pairing model prevents spam/abuse from the beginning
5. **Iterate on Feedback**: Each phase should be shippable; gather user feedback before Phase 6

---

## Key Architectural Decisions to Make Early

- **Message Bus**: Pub/sub or direct routing?
- **Session Storage**: SQLite, JSON files, or in-memory for MVP?
- **Tool Sandboxing**: Skip for MVP; add Docker later
- **Channel Config**: Per-channel config blocks or flat keys?
- **Agent Interface**: Stick with Pi agent RPC or build abstraction?

Start with the simplest answer for each; complicate only when forced.
