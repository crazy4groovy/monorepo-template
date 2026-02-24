# Chat Interface Plan - Phase 1 (MVP)

## Overview

This document outlines the implementation plan for Phase 1 MVP of OpenClaw, focusing on user interaction through the WebSocket Gateway, CLI, and a single messaging channel (Telegram). This phase establishes the core message loop that all subsequent features build upon.

---

## Phase 1 MVP Scope

The MVP delivers a functional AI chat interface where users can:

1. Configure a Telegram bot via JSON config
2. Send messages through the CLI to receive AI responses
3. Exchange messages with the AI assistant via Telegram

**Exit Criteria**: User configures a Telegram bot, sends a message via CLI or Telegram, receives an AI response back in Telegram.

---

## Sub-Service Architecture

### 1. WebSocket Gateway (`src/gateway`)

The Gateway serves as the central control plane managing all client connections and message routing.

#### Responsibilities

- **Connection Management**: Accept WebSocket clients on `ws://127.0.0.1:18789`
- **Session Lifecycle**: Create, maintain, and terminate user sessions
- **Message Routing**: Forward incoming messages to the appropriate channel and agent
- **Event Streaming**: Stream agent responses back to connected clients
- **Channel Coordination**: Manage Telegram bot lifecycle and message handling

#### Session Model

- Single `main` session for direct chats (Phase 1)
- Session holds conversation context and state
- Messages routed to main session by default

#### Configuration

```json
{
  "gateway": {
    "bind": "loopback",
    "port": 18789
  }
}
```

### 2. CLI (`src/cli`, `src/commands`)

The CLI provides command-line access to the Gateway for testing and automation.

#### Commands

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `openclaw gateway`      | Start the WebSocket Gateway        |
| `openclaw agent`        | Send messages to the agent via CLI |
| `openclaw message send` | Direct message sending to channels |
| `openclaw config`       | View/edit configuration            |
| `openclaw doctor`       | Diagnostics and connectivity check |

#### CLI to Gateway Communication

- CLI connects to Gateway via WebSocket
- Sends JSON messages with `type`, `sessionId`, `content`
- Receives streaming responses

#### Example Usage

```bash
# Start gateway
openclaw gateway

# Send message via CLI (connects to running gateway)
openclaw agent --message "Hello, what time is it?"

# Or use message send for direct channel output
openclaw message send --channel telegram --to USER_ID --message "Hello"
```

### 3. Telegram Channel (`src/telegram`)

Telegram integration uses the grammY library for bot API communication.

#### Bot Setup

1. Create bot via @BotFather on Telegram
2. Obtain bot token
3. Configure in `~/.openclaw/openclaw.json`

#### Configuration

```json
{
  "channels": {
    "telegram": {
      "botToken": "123456:ABCDEF"
    }
  }
}
```

#### Message Flow

1. User sends message to Telegram bot
2. Gateway receives update via grammY webhook/polling
3. Message routed to main session
4. Agent processes message
5. Response sent back via Telegram bot

#### Implemented Features (Phase 1)

- Text message receiving
- Text message sending
- User identification
- Basic error handling

---

## User Interaction Patterns

### Pattern 1: CLI-Initiated Conversation

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌───────┐     ┌───────────┐
│  CLI    │────▶│Gateway   │────▶│ Agent   │────▶│Gateway │────▶│ Telegram  │
│         │     │(WS)      │     │ Runtime │     │(WS)   │     │ Bot       │
└─────────┘     └──────────┘     └─────────┘     └───────┘     └───────────┘
  --message                                              streams response
```

1. User runs `openclaw agent --message "What is the weather?"`
2. CLI connects to Gateway WebSocket
3. CLI sends JSON: `{ "type": "message", "content": "What is the weather?" }`
4. Gateway routes to agent runtime
5. Agent processes and streams response
6. Gateway forwards to CLI (and Telegram if configured)

### Pattern 2: Telegram-Initiated Conversation

```
┌───────────┐     ┌──────────┐     ┌─────────┐     ┌───────┐     ┌───────────┐
│ Telegram  │────▶│ Gateway  │────▶│ Agent   │────▶│Gateway │────▶│ Telegram  │
│ User      │     │(WS)      │     │ Runtime │     │(WS)   │     │ Bot       │
└───────────┘     └──────────┘     └─────────┘     └───────┘     └───────────┘
  message                                               streams response
```

1. User sends message to Telegram bot
2. grammY receives update
3. Gateway receives via channel adapter
4. Routes to main session
5. Agent processes and streams response
6. Response sent back via Telegram bot API

---

## Component Interactions

### Message Protocol

All Gateway communication uses JSON messages over WebSocket:

#### Client to Gateway

```typescript
// Send message
{ "type": "message", "sessionId": "main", "content": "Hello" }

// Subscribe to session
{ "type": "subscribe", "sessionId": "main" }

// Ping
{ "type": "ping" }
```

#### Gateway to Client

```typescript
// Message response
{ "type": "message", "sessionId": "main", "content": "Hello!", "timestamp": 1234567890 }

// Stream chunk
{ "type": "chunk", "sessionId": "main", "content": "Hello" }

// Error
{ "type": "error", "error": "Failed to connect to agent" }

// Pong
{ "type": "pong" }
```

### Channel Adapter Interface

Each channel implements a common interface:

```typescript
interface ChannelAdapter {
  name: string
  start(): Promise<void>
  stop(): Promise<void>
  send(to: string, message: Message): Promise<void>
  onMessage(handler: (from: string, message: Message) => void): void
}
```

Telegram adapter implements this interface, allowing Gateway to treat all channels uniformly.

---

## Data Flow

### Request Lifecycle

1. **Input Received**
   - CLI: Parse `--message` argument, establish WS connection
   - Telegram: grammY webhook receives update

2. **Gateway Processing**
   - Validate message format
   - Create or retrieve session
   - Queue message for agent processing

3. **Agent Processing**
   - Load session context
   - Invoke Pi agent via RPC
   - Stream response chunks

4. **Response Delivery**
   - Stream chunks back through Gateway
   - Gateway forwards to originating channel
   - Channel adapter sends to platform (Telegram/CLI)

5. **Session Update**
   - Append message/response to session history
   - Persist if session persistence enabled

---

## File Structure

```
src/
├── gateway/
│   ├── index.ts          # Gateway entry point, WebSocket server
│   ├── session.ts        # Session management
│   ├── routing.ts        # Message routing logic
│   └── protocol.ts       # WebSocket message protocol
├── cli/
│   ├── index.ts          # CLI entry point
│   └── commands/
│       ├── gateway.ts    # Gateway start command
│       ├── agent.ts      # Agent message command
│       └── message.ts    # Direct message command
├── telegram/
│   ├── index.ts          # Telegram channel adapter
│   ├── bot.ts            # grammY bot setup
│   └── handler.ts        # Message handlers
├── agents/
│   └── runtime.ts        # Pi agent RPC client
└── config/
    └── index.ts          # Configuration loading
```

---

## Configuration File

Location: `~/.openclaw/openclaw.json`

```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-6"
  },
  "channels": {
    "telegram": {
      "botToken": "BOT_TOKEN_HERE"
    }
  },
  "gateway": {
    "bind": "loopback",
    "port": 18789
  }
}
```

---

## Dependencies

| Package                       | Purpose              |
| ----------------------------- | -------------------- |
| `ws`                          | WebSocket server     |
| `grammy`                      | Telegram bot API     |
| `commander`                   | CLI argument parsing |
| `@clack/prompts`              | CLI UI               |
| `zod`                         | Config validation    |
| `@mariozechner/pi-agent-core` | Agent runtime        |
| `yaml`                        | Config file support  |

---

## Testing Strategy

### Unit Tests

- Gateway message routing
- Session state management
- Protocol serialization
- Config validation

### Integration Tests

- CLI to Gateway communication
- Telegram bot message flow
- Agent response handling

### Manual Testing

- End-to-end CLI → Gateway → Agent → Telegram flow
- Gateway restart handling
- Invalid message handling

---

## Success Metrics

- [ ] Gateway starts and accepts WebSocket connections
- [ ] CLI can connect and send messages to Gateway
- [ ] Telegram bot receives and responds to messages
- [ ] Agent processes messages and returns coherent responses
- [ ] Configuration loads correctly from JSON file
- [ ] Basic error handling for invalid inputs

---

## Future Phases (Out of Scope)

- Additional channels (WhatsApp, Discord, Slack)
- Tool system (browser, bash, file access)
- Session persistence
- Voice capabilities
- Canvas/visual workspace
- Web UI control panel

These features build upon the Phase 1 foundation and will be addressed in subsequent phases.

---

## References

- [Gateway Documentation](https://docs.openclaw.ai/gateway)
- [Channel Integrations](https://docs.openclaw.ai/channels)
- [grammy Documentation](https://grammy.dev/)
- [Pi Agent Core](https://github.com/mariozechner/pi-agent-core)
