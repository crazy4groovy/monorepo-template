# OpenClaw Architecture Documentation

## Overview

OpenClaw is a **personal AI assistant** that runs on user-owned devices. It connects to various messaging platforms and provides voice interaction, visual canvas, and device control capabilities. The project emphasizes local-first deployment with multi-channel support.

**Repository**: https://github.com/openclaw/openclaw  
**Website**: https://openclaw.ai  
**Documentation**: https://docs.openclaw.ai

---

## Core Features

### 1. Multi-Channel Messaging

OpenClaw integrates with numerous messaging platforms:

| Channel | SDK/Library | Status |
|---------|-------------|--------|
| WhatsApp | Baileys (@whiskeysockets/baileys) | Built-in |
| Telegram | grammY | Built-in |
| Slack | @slack/bolt | Built-in |
| Discord | discord.js | Built-in |
| Google Chat | @larksuiteoapi/node-sdk | Built-in |
| Signal | signal-cli | Built-in |
| BlueBubbles (iMessage) | REST API | Built-in |
| iMessage (legacy) | imsg | Built-in |
| Microsoft Teams | Bot Framework | Extension |
| Matrix | matrix-sdk | Extension |
| Zalo | Zalo API | Extension |
| WebChat | Gateway WS | Built-in |

### 2. Voice Capabilities

- **Voice Wake**: Always-on voice detection for macOS/iOS/Android
- **Talk Mode**: Continuous voice conversation using ElevenLabs TTS
- **Voice Call Extension**: `extensions/voice-call`

### 3. Canvas & Visual Workspace

- Agent-driven visual workspace with A2UI support
- Real-time canvas push/reset, eval, snapshot
- macOS/iOS/Android Canvas nodes

### 4. Browser Control

- Dedicated OpenClaw Chrome/Chromium instance
- CDP (Chrome DevTools Protocol) control
- Snapshots, actions, uploads, profiles

### 5. Companion Apps

- **macOS**: Menu bar app with Voice Wake, Talk Mode overlay, WebChat
- **iOS**: Canvas, Voice Wake, Talk Mode, camera, screen recording
- **Android**: Canvas, Talk Mode, camera, screen recording, SMS

### 6. Skills & Agents

- Bundled, managed, and workspace skills
- ClawHub skill registry for automatic skill discovery
- Workspace root: `~/.openclaw/workspace`

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Messaging Channels                           │
│  WhatsApp / Telegram / Slack / Discord / Signal / iMessage   │
│  Microsoft Teams / Matrix / Zalo / WebChat                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Gateway                                  │
│                  (WebSocket Control Plane)                      │
│                 ws://127.0.0.1:18789                            │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   CLI       │ │  Web UI     │ │  Pi Agent   │              │
│  │  (openclaw) │ │ (Control)   │ │   (RPC)     │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  Channels   │ │   Tools     │ │  Sessions   │              │
│  │  (routing)  │ │ (browser,   │ │  (context)  │              │
│  │             │ │   canvas)   │ │             │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Device Nodes                               │
│           (macOS app / iOS / Android via Bridge)               │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ system.run  │ │   camera    │ │   canvas    │              │
│  │ system.notif│ │   screen    │ │  location   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Gateway (`src/gateway`)

The central WebSocket control plane that manages:
- Session lifecycle and context
- Channel connections and routing
- Tool execution
- Event streaming
- Cron jobs and webhooks

**Key Files**:
- `src/gateway/index.ts` - Main gateway entry
- `src/gateway/session.ts` - Session management
- `src/gateway/routing.ts` - Message routing logic

#### 2. CLI (`src/cli`, `src/commands`)

Command-line interface with subcommands:
- `openclaw gateway` - Start the Gateway
- `openclaw agent` - Send messages to the agent
- `openclaw message send` - Direct message sending
- `openclaw channels` - Channel management
- `openclaw onboard` - Onboarding wizard
- `openclaw doctor` - Diagnostics

#### 3. Agent Runtime (`src/agents`)

- Pi agent runtime in RPC mode
- Tool streaming and block streaming support
- Session model with `main` session for direct chats

#### 4. Channel Implementations

Built-in channels in `src/`:
- `src/whatsapp/` - WhatsApp via Baileys
- `src/telegram/` - Telegram via grammY
- `src/slack/` - Slack via @slack/bolt
- `src/discord/` - Discord via discord.js
- `src/signal/` - Signal via signal-cli
- `src/imessage/` - Legacy iMessage

Extensions in `extensions/`:
- `extensions/msteams/` - Microsoft Teams
- `extensions/matrix/` - Matrix
- `extensions/zalo/` - Zalo
- `extensions/voice-call/` - Voice calls

#### 5. Tools (`src/plugins`)

Built-in tools:
- **Browser**: CDP-based browser control
- **Canvas**: Visual workspace interaction
- **Nodes**: Device-specific actions (camera, screen, location)
- **Cron**: Scheduled tasks
- **Sessions**: Cross-session communication

#### 6. Media Pipeline (`src/media`)

- Image/audio/video processing
- Transcription hooks
- Size caps and temp file lifecycle
- TTS integration (Edge TTS)

---

## Technology Stack

### Runtime
- **Node.js**: >= 22.12.0
- **Package Manager**: pnpm (10.23.0)

### Key Dependencies

| Category | Libraries |
|----------|-----------|
| Messaging | @whiskeysockets/baileys, grammY, @slack/bolt, discord.js, @larksuiteoapi/node-sdk |
| AI/Agent | @mariozechner/pi-agent-core, @mariozechner/pi-ai |
| Web | express, ws, undici |
| Browser | playwright-core |
| Media | sharp, pdfjs-dist, opusscript |
| Storage | sqlite-vec |
| Config | zod, ajv, yaml, json5 |
| CLI | commander, @clack/prompts |

### Build Tools
- **TypeScript**: ^5.9.3
- **tsdown**: Bundler
- **oxlint/oxfmt**: Linting and formatting
- **vitest**: Testing framework

---

## Project Structure

```
openclaw/
├── src/                    # Core source code
│   ├── gateway/            # WebSocket control plane
│   ├── cli/                # CLI entry points
│   ├── commands/           # CLI commands
│   ├── channels/           # Channel routing
│   ├── whatsapp/           # WhatsApp integration
│   ├── telegram/           # Telegram integration
│   ├── slack/              # Slack integration
│   ├── discord/            # Discord integration
│   ├── signal/             # Signal integration
│   ├── imessage/           # iMessage integration
│   ├── agents/             # Agent runtime
│   ├── sessions/           # Session management
│   ├── plugins/            # Built-in tools
│   ├── browser/            # Browser control
│   ├── canvas-host/        # Canvas hosting
│   ├── media/              # Media pipeline
│   ├── providers/          # Model providers
│   ├── config/             # Configuration
│   └── ...
├── extensions/             # Optional channel extensions
│   ├── msteams/            # Microsoft Teams
│   ├── matrix/             # Matrix
│   ├── voice-call/         # Voice calls
│   └── ...
├── apps/                  # Mobile/desktop apps
│   ├── macos/              # macOS app (Swift)
│   ├── ios/                # iOS app (Swift)
│   └── android/            # Android app (Kotlin)
├── packages/               # Shared packages
├── skills/                 # Bundled skills
├── docs/                   # Documentation
└── test/                   # Test files
```

---

## Configuration

OpenClaw uses `~/.openclaw/openclaw.json` for configuration:

```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-6"
  },
  "channels": {
    "telegram": {
      "botToken": "123456:ABCDEF"
    },
    "discord": {
      "token": "1234abcd"
    }
  },
  "gateway": {
    "bind": "loopback",
    "port": 18789
  }
}
```

---

## Security Model

- **Default**: Tools run on the host for the main session
- **Group safety**: Non-main sessions can run in Docker sandboxes
- **DM pairing**: Unknown senders require pairing approval
- **Sandbox config**: Configurable allowlist/denylist for tools

---

## Deployment Options

1. **Local Gateway** (default): Runs on localhost
2. **Tailscale Serve/Funnel**: Remote access via Tailscale
3. **SSH Tunnels**: Alternative remote access
4. **Docker**: Containerized deployment
5. **Nix**: Declarative configuration

---

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run gateway
pnpm gateway:watch

# Run tests
pnpm test

# Lint/format
pnpm check
```

---

## References

- [Official Docs](https://docs.openclaw.ai)
- [Gateway Documentation](https://docs.openclaw.ai/gateway)
- [Channel Integrations](https://docs.openclaw.ai/channels)
- [Tools Reference](https://docs.openclaw.ai/tools)
- [macOS App](https://docs.openclaw.ai/platforms/macos)
- [iOS Node](https://docs.openclaw.ai/platforms/ios)
- [Android Node](https://docs.openclaw.ai/platforms/android)
