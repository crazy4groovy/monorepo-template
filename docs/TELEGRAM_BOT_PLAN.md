# Telegram Bot Implementation Plan

## Overview

Add a **Telegram Bot** package using **Telegraf.js** for receiving/sending messages and media in Express.

## Why Telegraf?

- Full Telegram Bot API 7.1 support
- Express/Node.js compatible
- TypeScript support
- Webhook or long-polling modes

---

## Implementation

### 1. Create Package

```
packages/telegram/
├── src/
│   ├── index.ts           # Main exports
│   ├── bot.ts            # Bot instance
│   ├── handlers/         # Message handlers
│   │   ├── text.ts
│   │   ├── photo.ts
│   │   └── commands.ts
│   └── services/         # Send utilities
│       ├── message.ts
│       └── media.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "telegraf": "^4.16.0"
  }
}
```

### 3. Bot Setup (`src/bot.ts`)

```typescript
import { Telegraf } from 'telegraf'

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

export function launchBot() {
  bot.launch()
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
```

### 4. Message Handler (`src/handlers/text.ts`)

```typescript
import { bot } from '../bot'
import { message } from 'telegraf/filters'

bot.on(message('text'), (ctx) => {
  ctx.reply(`Echo: ${ctx.message.text}`)
})
```

### 5. Photo Handler (`src/handlers/photo.ts`)

```typescript
import { bot } from '../bot'
import { message } from 'telegraf/filters'
import { Input } from 'telegraf'

bot.on(message('photo'), async (ctx) => {
  const photo = ctx.message.photo[0]
  const file = await ctx.telegram.getFile(photo.file_id)

  ctx.reply(`Received photo! (${photo.width}x${photo.height})`)
})
```

### 6. Send Message (`src/services/message.ts`)

```typescript
import { bot } from '../bot'

export async function sendMessage(chatId: string, text: string) {
  return bot.telegram.sendMessage(chatId, text)
}
```

### 7. Send Photo (`src/services/media.ts`)

```typescript
import { bot } from '../bot'
import { Input } from 'telegraf'

export async function sendPhoto(chatId: string, photo: string | Buffer | URL) {
  return bot.telegram.sendPhoto(chatId, Input.fromLocalFile(photo))
}

export async function sendPhotoURL(chatId: string, url: string) {
  return bot.telegram.sendPhoto(chatId, Input.fromURL(url))
}
```

### 8. Integration with Express

```typescript
import { bot } from 'telegram'
import express from 'express'

const app = express()
app.use(express.json())

app.use(await bot.createWebhook({ domain: 'https://yourdomain.com' }))

app.listen(3000)
```

---

## Environment

```env
TELEGRAM_BOT_TOKEN=123456789:AbCdefGhIJKlmNoPQRsTUVwxyZ
```

Get token from [@BotFather](https://t.me/BotFather) on Telegram.

---

## File Sources

Telegraf supports multiple input types:

- `Input.fromLocalFile('/path/to/file')`
- `Input.fromURL('https://...')`
- `Input.fromBuffer(Buffer)`
- `Input.fromReadableStream(stream)`

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- Session middleware for user state
- Inline keyboards / buttons
- Group chat management
- Voice messages
- Video support
