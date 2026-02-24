# AI Landscape Tracker — Complete Build Kit

> Give this file to Claude Code and say: "Read this file and help me set it up step by step."
>
> Built by Liam Ottley — one of the autonomous systems running inside the AI Operating System I use to run my businesses.

---

## Why This Exists

AI models change constantly. New leaders emerge, prices drop, capabilities shift — and if you're building AI systems for yourself or clients, you need to know what's best RIGHT NOW, not what was best 3 months ago when you last checked.

The problem: most people either waste time manually checking leaderboards, rely on outdated knowledge, or just default to "use GPT-4" for everything because they don't know what else is out there.

This system solves that by creating a **living knowledge layer** that runs autonomously. Every morning it scans the top AI model leaderboards, stores the rankings in a database, and detects what changed overnight. The output is a set of reference docs that any AI agent (including Claude Code) can read — so your AI setup always knows which models are the current leaders and exactly how to use them.

**Practical example:** When I ask Claude Code to build something that needs image generation, it doesn't guess — it reads the reference docs and knows that GPT Image 1.5 is currently #1 on LMArena. When I need a budget transcription model, it knows Gemini 2.5 Flash does 6.7% WER at $0.14/hr. When a new model takes the #1 spot in any category, I know about it before breakfast without lifting a finger.

This is one piece of a larger AI Operating System I've built across my businesses — but it's one of the most universally useful, and it works as a standalone system.

---

## What You're Building

An autonomous system that:

1. Scans **10 AI model categories** every morning from public leaderboards
2. Stores rankings in a local SQLite database
3. Compares today vs yesterday and flags what changed
4. Outputs a JSON summary + markdown report
5. Generates living reference docs your Claude Code agent can read
6. (Optional) Spawns Claude Code research agents to deep-dive any changes — pricing, integration code, community sentiment

**10 categories tracked:**

- **Tier 1 (LMArena — arena.ai):** text, code, vision, text-to-image, image-edit, search, text-to-video, image-to-video
- **Tier 2:** text-to-speech (TTS Arena V2), speech-to-text (Voice Writer)

**Cost:** $0/day for scanning (all public data). ~$5-15 if you run the deep-dive research command.

**Requirements:** Node.js 18+, TypeScript, Claude Code (for the research command)

---

## Project Structure

```
ai-landscape-tracker/
├── data/                        # Auto-created
│   ├── tracker.db               # SQLite database
│   └── ai-scan-latest.json      # Latest scan output
├── output/
│   └── reports/                 # Daily markdown reports
├── docs/                        # Auto-generated AI reference docs
│   └── {category}/state-of-the-art.md
├── src/
│   ├── db.ts                   # Database schema + writers
│   ├── scan.ts                 # Main scanner (run this daily)
│   └── collectors/
│       ├── index.ts
│       ├── lmarena.ts          # LMArena scraper (8 categories)
│       ├── tts_arena.ts        # TTS Arena V2 scraper
│       ├── stt_leaderboard.ts  # Voice Writer scraper
│       └── openrouter.ts       # OpenRouter API (pricing data)
├── .claude/
│   └── commands/
│       └── update-ai-docs.md   # Deep-dive research command
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup Instructions

### Step 1: Create the project folder

```bash
mkdir -p ai-landscape-tracker/{data,output/reports,docs,src/collectors,.claude/commands}
cd ai-landscape-tracker
npm init -y
```

### Step 2: Install dependencies

```bash
npm install better-sqlite3 axios dotenv
npm install -D typescript @types/node @types/better-sqlite3 tsx
```

### Step 3: Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4: Create .env.example (and copy to .env)

```bash
# .env.example
# Optional: OpenRouter API key for pricing data (free account at openrouter.ai)
OPENROUTER_API_KEY=
```

```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key (optional but recommended)
```

### Step 5: Create all the scripts

Create each file below in the exact path shown.

---

## File: src/db.ts

```typescript
/**
 * Database schema and writer functions for the AI Landscape Tracker.
 * Self-contained — no external dependencies beyond better-sqlite3.
 */

import Database from 'better-sqlite3'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ROOT = '../../'
const DB_PATH = `${PROJECT_ROOT}data/tracker.db`

const SCHEMA_SQL = `
-- AI model rankings from benchmark leaderboards
CREATE TABLE IF NOT EXISTS ai_models (
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    source TEXT NOT NULL,
    model_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    provider TEXT,
    elo_score REAL,
    quality_index REAL,
    speed_score REAL,
    price_input REAL,
    price_output REAL,
    context_length INTEGER,
    rank_in_category INTEGER,
    metadata TEXT,
    PRIMARY KEY (date, category, source, model_id)
);

-- Scan log (tracks daily scans and change detection)
CREATE TABLE IF NOT EXISTS ai_scan_log (
    scan_date TEXT NOT NULL,
    scan_type TEXT NOT NULL,
    categories_scanned TEXT,
    new_models_found INTEGER DEFAULT 0,
    ranking_changes INTEGER DEFAULT 0,
    docs_updated TEXT,
    cost_usd REAL DEFAULT 0,
    duration_seconds REAL,
    summary TEXT,
    PRIMARY KEY (scan_date, scan_type)
);

-- Collection log (audit trail)
CREATE TABLE IF NOT EXISTS collection_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collected_at TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    reason TEXT,
    records_written INTEGER DEFAULT 0
);
`

export interface AIModel {
  date: string
  category: string
  source: string
  model_id: string
  model_name: string
  provider: string | null
  elo_score: number | null
  quality_index: number | null
  speed_score: number | null
  price_input: number | null
  price_output: number | null
  context_length: number | null
  rank_in_category: number | null
  metadata: Record<string, unknown> | null
}

export interface CollectorResult {
  source: string
  status: 'success' | 'error' | 'skipped'
  reason?: string
  data?: {
    models: AIModel[]
    total_models: number
    categories?: Record<string, number>
    errors?: string[]
  }
}

export function initDb(): Database.Database {
  const dbDir = dirname(DB_PATH)
  mkdirSync(dbDir, { recursive: true })
  const conn = Database(DB_PATH)
  conn.exec(SCHEMA_SQL)
  return conn
}

export function writeAiModels(
  conn: Database.Database,
  result: CollectorResult,
  date: string
): number {
  if (result.status !== 'success' || !result.data) {
    return 0
  }

  const sourceName = result.source
  const models = result.data.models
  let records = 0

  const stmt = conn.prepare(`
    INSERT OR REPLACE INTO ai_models 
    (date, category, source, model_id, model_name, provider, 
    elo_score, quality_index, speed_score, price_input, price_output, 
    context_length, rank_in_category, metadata) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = conn.transaction((models: AIModel[]) => {
    for (const model of models) {
      const metaStr = model.metadata ? JSON.stringify(model.metadata) : null
      stmt.run(
        date,
        model.category,
        sourceName,
        model.model_id,
        model.model_name,
        model.provider,
        model.elo_score,
        model.quality_index,
        model.speed_score,
        model.price_input,
        model.price_output,
        model.context_length,
        model.rank_in_category,
        metaStr
      )
      records++
    }
  })

  insertMany(models)
  return records
}

export function writeScanLog(
  conn: Database.Database,
  scanDate: string,
  scanType: string,
  categories: string,
  newModels: number,
  rankingChanges: number,
  summary: string,
  duration: number = 0
): void {
  conn
    .prepare(
      `
    INSERT OR REPLACE INTO ai_scan_log 
    (scan_date, scan_type, categories_scanned, new_models_found, 
    ranking_changes, docs_updated, cost_usd, duration_seconds, summary) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(scanDate, scanType, categories, newModels, rankingChanges, null, 0, duration, summary)
}
```

---

## File: src/collectors/index.ts

```typescript
// Collectors package
export * from './lmarena.js'
export * from './tts_arena.js'
export * from './stt_leaderboard.js'
export * from './openrouter.js'
```

---

## File: src/collectors/lmarena.ts

```typescript
/**
 * LMArena (arena.ai) leaderboard scraper.
 *
 * Scrapes live ELO rankings for 8 AI model categories from arena.ai.
 * The site uses Next.js SSR — data is embedded as JSON in self.__next_f.push() chunks.
 *
 * No API key required — public website.
 */

import axios from 'axios'

const BASE_URL = 'https://arena.ai/leaderboard'

const CATEGORIES = [
  'text',
  'code',
  'vision',
  'text-to-image',
  'image-edit',
  'search',
  'text-to-video',
  'image-to-video',
]

const ORG_MAP: Record<string, string> = {
  anthropic: 'anthropic',
  openai: 'openai',
  google: 'google',
  xai: 'xai',
  meta: 'meta',
  mistral: 'mistral',
  cohere: 'cohere',
  alibaba: 'alibaba',
  microsoft: 'microsoft',
  amazon: 'amazon',
  deepseek: 'deepseek',
  bytedance: 'bytedance',
  stability: 'stability',
  'black forest': 'black-forest-labs',
  midjourney: 'midjourney',
  ideogram: 'ideogram',
  recraft: 'recraft',
}

const NAME_PATTERNS: Record<string, string> = {
  claude: 'anthropic',
  'gpt-': 'openai',
  chatgpt: 'openai',
  'o1-': 'openai',
  'o3-': 'openai',
  'o4-': 'openai',
  gemini: 'google',
  gemma: 'google',
  imagen: 'google',
  'veo-': 'google',
  grok: 'xai',
  deepseek: 'deepseek',
  llama: 'meta',
  mistral: 'mistral',
  mixtral: 'mistral',
  qwen: 'alibaba',
  'phi-': 'microsoft',
  'dall-e': 'openai',
  'gpt-image': 'openai',
  'stable-diffusion': 'stability',
  flux: 'black-forest-labs',
  midjourney: 'midjourney',
  sora: 'openai',
  kling: 'kuaishou',
  doubao: 'bytedance',
  seed: 'bytedance',
  'dola-seed': 'bytedance',
}

interface LMArenaEntry {
  rating: number
  modelDisplayName: string
  modelOrganization?: string
  rank?: number
  votes?: number
  license?: string
}

function parseProvider(modelName: string, organization?: string): string {
  if (organization) {
    const orgLower = organization.toLowerCase()
    for (const [pattern, provider] of Object.entries(ORG_MAP)) {
      if (orgLower.includes(pattern)) {
        return provider
      }
    }
  }

  const nameLower = modelName.toLowerCase()
  for (const [pattern, provider] of Object.entries(NAME_PATTERNS)) {
    if (nameLower.includes(pattern)) {
      return provider
    }
  }
  return organization || 'unknown'
}

async function fetchLeaderboard(category: string): Promise<LMArenaEntry[] | null> {
  const url = `${BASE_URL}/${category}`
  const resp = await axios.get(url, { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } })
  const text = resp.data

  const pos = text.indexOf('entries')
  if (pos < 0) return null

  const bracketStart = text.indexOf('[', pos)
  if (bracketStart < 0) return null

  let chunk = text.substring(bracketStart, bracketStart + 500000)
  chunk = chunk.replace(/\\"/g, '"')

  let depth = 0
  let end = 0
  for (let j = 0; j < chunk.length; j++) {
    const c = chunk[j]
    if (c === '[') {
      depth++
    } else if (c === ']') {
      depth--
      if (depth === 0) {
        end = j + 1
        break
      }
    }
  }

  if (end === 0) return null

  const jsonStr = chunk.substring(0, end)
  return JSON.parse(jsonStr)
}

export async function collect(): Promise<{
  source: string
  status: string
  reason?: string
  data?: {
    models: Array<Record<string, unknown>>
    total_models: number
    categories: Record<string, number>
    errors?: string[]
  }
}> {
  const allModels: Array<Record<string, unknown>> = []
  const errors: string[] = []

  for (const category of CATEGORIES) {
    try {
      const entries = await fetchLeaderboard(category)
      if (!entries) {
        errors.push(`${category}: no entries found`)
        continue
      }

      for (const entry of entries) {
        const rating = entry.rating
        if (!rating || rating <= 0) continue

        const modelName = entry.modelDisplayName
        const organization = entry.modelOrganization

        allModels.push({
          model_id: `lmarena:${modelName}`,
          model_name: modelName,
          provider: parseProvider(modelName, organization),
          category,
          elo_score: Math.round(rating * 10) / 10,
          quality_index: null,
          speed_score: null,
          price_input: null,
          price_output: null,
          context_length: null,
          rank_in_category: entry.rank,
          metadata: {
            source: 'lmarena',
            organization,
            votes: entry.votes,
            license: entry.license,
          },
        })
      }
    } catch (e) {
      errors.push(`${category}: ${e}`)
    }
  }

  if (allModels.length === 0) {
    return {
      source: 'lmarena',
      status: 'error',
      reason: `No models collected. Errors: ${errors.join('; ')}`,
    }
  }

  const categories: Record<string, number> = {}
  for (const m of allModels) {
    const cat = m.category as string
    categories[cat] = (categories[cat] || 0) + 1
  }

  return {
    source: 'lmarena',
    status: 'success',
    data: {
      models: allModels,
      total_models: allModels.length,
      categories,
      errors: errors.length > 0 ? errors : undefined,
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  collect().then((result) => {
    if (result.status === 'success' && result.data) {
      console.log(`Total models: ${result.data.total_models}`)
      console.log(`Categories: ${result.data.categories}`)
      for (const cat of CATEGORIES) {
        const top = result.data!.models.filter((m: Record<string, unknown>) => m.category === cat)
        if (top.length > 0) {
          const m = top[0] as Record<string, unknown>
          console.log(`  ${cat.padEnd(20)}: ${m.model_name} (${m.provider}) ELO:${m.elo_score}`)
        }
      }
    } else {
      console.log(`Error: ${result.reason}`)
    }
  })
}
```

---

## File: src/collectors/tts_arena.ts

```typescript
/**
 * TTS Arena V2 leaderboard scraper.
 *
 * Scrapes TTS model rankings (ELO-based) from HuggingFace.
 * Source: https://huggingface.co/spaces/tts-agi/tts-arena-v2
 *
 * No API key required.
 */

import axios from 'axios'

const LEADERBOARD_URL = 'https://tts-agi-tts-arena-v2.hf.space/leaderboard'
const CATEGORY = 'text-to-speech'
const SOURCE = 'tts_arena'

const PROVIDER_PATTERNS: Record<string, string> = {
  elevenlabs: 'elevenlabs',
  'eleven ': 'elevenlabs',
  openai: 'openai',
  'gpt-4o': 'openai',
  hume: 'hume',
  octave: 'hume',
  google: 'google',
  cartesia: 'cartesia',
  sonic: 'cartesia',
  deepgram: 'deepgram',
  aura: 'deepgram',
  playht: 'playht',
  'play.ht': 'playht',
  sesame: 'sesame',
  kokoro: 'kokoro',
  vocu: 'vocu',
  minimax: 'minimax',
  fish: 'fish-audio',
  lmnt: 'lmnt',
}

function parseProvider(modelName: string): string {
  const nameLower = modelName.toLowerCase()
  for (const [pattern, provider] of Object.entries(PROVIDER_PATTERNS)) {
    if (nameLower.includes(pattern)) {
      return provider
    }
  }
  return 'unknown'
}

export async function collect(): Promise<{
  source: string
  status: string
  reason?: string
  data?: {
    models: Array<Record<string, unknown>>
    total_models: number
  }
}> {
  try {
    const resp = await axios.get(LEADERBOARD_URL, {
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const text = resp.data

    const rankMatch = text.matchAll(
      /class="rank">#?(\d+)<\/div>.*?class="model-name-link">(.*?)<\/a>.*?class="win-rate">(\d+)%<\/div>.*?class="total-votes">([\d,]+)<\/div>.*?class="elo-score">([\d,.]+)<\/div>/g
    )

    const entries: Array<[string, string, string, string, string]> = []
    for (const match of rankMatch) {
      entries.push([match[1], match[2], match[3], match[4], match[5]])
    }

    let models: Array<Record<string, unknown>> = []

    if (entries.length >= 3) {
      for (const [rankStr, name, winRate, votesStr, eloStr] of entries) {
        const nameClean = name.trim()
        try {
          const elo = parseFloat(eloStr.replace(',', ''))
          const rank = parseInt(rankStr)
          const votes = parseInt(votesStr.replace(',', ''))
          if (nameClean && elo > 0) {
            models.push({
              model_id: `tts_arena:${nameClean}`,
              model_name: nameClean,
              provider: parseProvider(nameClean),
              category: CATEGORY,
              elo_score: Math.round(elo * 10) / 10,
              rank_in_category: rank,
              quality_index: null,
              speed_score: null,
              price_input: null,
              price_output: null,
              context_length: null,
              metadata: { source: SOURCE, votes, win_rate_pct: parseInt(winRate) },
            })
          }
        } catch {
          continue
        }
      }
    } else {
      const simpleMatch = text.matchAll(
        /class="model-name-link">(.*?)<\/a>.*?class="elo-score">([\d,.]+)/g
      )
      let idx = 0
      for (const match of simpleMatch) {
        const nameClean = match[1].trim()
        try {
          const elo = parseFloat(match[2].replace(',', ''))
          if (nameClean && elo > 0) {
            models.push({
              model_id: `tts_arena:${nameClean}`,
              model_name: nameClean,
              provider: parseProvider(nameClean),
              category: CATEGORY,
              elo_score: Math.round(elo * 10) / 10,
              rank_in_category: idx + 1,
              quality_index: null,
              speed_score: null,
              price_input: null,
              price_output: null,
              context_length: null,
              metadata: { source: SOURCE },
            })
            idx++
          }
        } catch {
          continue
        }
      }
    }

    models.sort((a, b) => (b.elo_score as number) - (a.elo_score as number))
    models.forEach((m, i) => {
      m.rank_in_category = i + 1
    })

    if (models.length < 3) {
      return { source: SOURCE, status: 'skipped', reason: 'Too few models parsed' }
    }

    return {
      source: SOURCE,
      status: 'success',
      data: { models, total_models: models.length },
    }
  } catch (e) {
    return { source: SOURCE, status: 'error', reason: String(e) }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  collect().then((result) => {
    if (result.status === 'success' && result.data) {
      for (const m of result.data.models.slice(0, 10)) {
        console.log(
          `  #${String(m.rank_in_category).padStart(2)} ${(m.model_name as string).padEnd(30)} (${(m.provider as string).padEnd(15)}) ELO:${m.elo_score}`
        )
      }
    } else {
      console.log(`Status: ${result.status} — ${result.reason || ''}`)
    }
  })
}
```

---

## File: src/collectors/stt_leaderboard.ts

```typescript
/**
 * Voice Writer Speech-to-Text leaderboard scraper.
 *
 * Scrapes STT model rankings from voicewriter.io.
 * Metric: WER (Word Error Rate) — lower is better.
 * Stored as NEGATIVE elo_score so ORDER BY DESC puts best first.
 *
 * Source: https://voicewriter.io/speech-recognition-leaderboard
 * No API key required.
 */

import axios from 'axios'

const LEADERBOARD_URL = 'https://voicewriter.io/speech-recognition-leaderboard'
const CATEGORY = 'speech-to-text'
const SOURCE = 'voice_writer'

const PROVIDER_PATTERNS: Record<string, string> = {
  openai: 'openai',
  gpt: 'openai',
  whisper: 'openai',
  google: 'google',
  gemini: 'google',
  chirp: 'google',
  deepgram: 'deepgram',
  nova: 'deepgram',
  assemblyai: 'assemblyai',
  assembly: 'assemblyai',
  elevenlabs: 'elevenlabs',
  eleven: 'elevenlabs',
  amazon: 'amazon',
  aws: 'amazon',
  azure: 'microsoft',
  microsoft: 'microsoft',
  speechmatics: 'speechmatics',
  nvidia: 'nvidia',
  gladia: 'gladia',
  soniox: 'soniox',
  groq: 'groq',
}

function parseProvider(modelName: string): string {
  const nameLower = modelName.toLowerCase()
  for (const [pattern, provider] of Object.entries(PROVIDER_PATTERNS)) {
    if (nameLower.includes(pattern)) {
      return provider
    }
  }
  return 'unknown'
}

export async function collect(): Promise<{
  source: string
  status: string
  reason?: string
  data?: {
    models: Array<Record<string, unknown>>
    total_models: number
  }
}> {
  try {
    const resp = await axios.get(LEADERBOARD_URL, {
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = resp.data

    const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/s)
    if (!tableMatch) {
      return { source: SOURCE, status: 'skipped', reason: 'No table found on Voice Writer page' }
    }

    const rows = tableMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gs) || []
    if (rows.length < 2) {
      return { source: SOURCE, status: 'skipped', reason: 'No data rows' }
    }

    const models: Array<Record<string, unknown>> = []
    let rank = 0

    for (const rowHtml of rows.slice(1)) {
      const cells = rowHtml.match(/<td[^>]*>(.*?)<\/td>/gs) || []
      if (cells.length < 3) continue

      const nameMatch = cells[0].match(/<span>(.*?)<\/span>/)
      const name = nameMatch ? nameMatch[1].trim() : cells[0].replace(/<[^>]+>/g, '').trim()
      if (!name) continue

      const werText = cells[1].replace(/<[^>]+>/g, '').replace(/<!--|-->/g, '')
      const werMatch = werText.match(/([\d.]+)\s*%?/)
      if (!werMatch) continue
      const wer = parseFloat(werMatch[1])

      let pricePerHour: number | null = null
      if (cells.length > 3) {
        const priceMatch = cells[3].replace(/<[^>]+>/g, '').match(/\$?([\d.]+)/)
        if (priceMatch) {
          pricePerHour = parseFloat(priceMatch[1])
        }
      }

      rank++
      models.push({
        model_id: `voice_writer:${name}`,
        model_name: name,
        provider: parseProvider(name),
        category: CATEGORY,
        elo_score: Math.round(-wer * 100) / 100,
        quality_index: null,
        speed_score: null,
        price_input: pricePerHour,
        price_output: null,
        context_length: null,
        rank_in_category: rank,
        metadata: { source: SOURCE, wer_pct: wer, price_per_hour_usd: pricePerHour },
      })
    }

    if (models.length < 3) {
      return { source: SOURCE, status: 'skipped', reason: 'Too few models parsed' }
    }

    models.sort((a, b) => (b.elo_score as number) - (a.elo_score as number))
    models.forEach((m, i) => {
      m.rank_in_category = i + 1
    })

    return {
      source: SOURCE,
      status: 'success',
      data: { models, total_models: models.length },
    }
  } catch (e) {
    return { source: SOURCE, status: 'error', reason: String(e) }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  collect().then((result) => {
    if (result.status === 'success' && result.data) {
      for (const m of result.data.models.slice(0, 10)) {
        const wer = (m.metadata as Record<string, unknown>).wer_pct as number
        const price = (m.metadata as Record<string, unknown>).price_per_hour_usd as number | null
        const priceStr = price !== null ? `$${price.toFixed(2)}/hr` : 'N/A'
        console.log(
          `  #${String(m.rank_in_category).padStart(2)} ${(m.model_name as string).padEnd(30)} (${(m.provider as string).padEnd(15)}) WER:${wer.toFixed(1)}%  ${priceStr}`
        )
      }
    } else {
      console.log(`Status: ${result.status} — ${result.reason || ''}`)
    }
  })
}
```

---

## File: src/collectors/openrouter.ts

```typescript
/**
 * OpenRouter API collector — model catalog with pricing data.
 *
 * Enriches the tracker with pricing and context length info.
 * Requires: OPENROUTER_API_KEY (free account at openrouter.ai)
 *
 * This collector is OPTIONAL. The tracker works without it —
 * you just won't have pricing data in your reports.
 */

import axios from 'axios'
import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename)

config({ path: resolve(__dirname, '../../.env') })

const API_URL = 'https://openrouter.ai/api/v1/models'

function inferCategory(model: Record<string, unknown>): string {
  const arch = (model.architecture as Record<string, unknown>) || {}
  const modality = ((arch.output_modalities as string[]) || []).map((m) => m.toLowerCase())
  const outputMods = modality
  const inputMods = ((arch.input_modalities as string[]) || []).map((m) => m.toLowerCase())

  if (outputMods.includes('image') && !outputMods.includes('text')) {
    return 'image-generation'
  }
  if (modality.includes('->image')) {
    return 'image-generation'
  }
  if (modality.includes('->audio')) {
    return 'text-to-speech'
  }
  if (inputMods.includes('audio') && outputMods.includes('text') && !inputMods.includes('image')) {
    return 'speech-to-text'
  }
  if (inputMods.includes('text') && outputMods.includes('text')) {
    return 'text-generation'
  }
  return 'text-generation'
}

export async function collect(): Promise<{
  source: string
  status: string
  reason?: string
  data?: {
    models: Array<Record<string, unknown>>
    total_models: number
    categories: Record<string, number>
  }
}> {
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim()
  if (!apiKey) {
    return {
      source: 'openrouter',
      status: 'skipped',
      reason: 'Missing OPENROUTER_API_KEY (optional — add to .env)',
    }
  }

  try {
    const resp = await axios.get(API_URL, {
      timeout: 30000,
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    })
    const modelsRaw = resp.data.data || []

    const models: Array<Record<string, unknown>> = []
    const categories: Record<string, number> = {}

    for (const item of modelsRaw) {
      const modelId = item.id || ''
      const name = item.name || modelId
      const provider = modelId.includes('/') ? modelId.split('/')[0] : ''
      const pricing = item.pricing || {}

      let priceIn: number | null = null
      let priceOut: number | null = null
      try {
        priceIn = parseFloat(pricing.prompt) * 1_000_000
      } catch {
        /* empty */
      }
      try {
        priceOut = parseFloat(pricing.completion) * 1_000_000
      } catch {
        /* empty */
      }

      const category = inferCategory(item)
      categories[category] = (categories[category] || 0) + 1

      models.push({
        model_id: modelId,
        model_name: name,
        provider,
        category,
        elo_score: null,
        quality_index: null,
        speed_score: null,
        price_input: priceIn,
        price_output: priceOut,
        context_length: item.context_length,
        rank_in_category: null,
        metadata: {
          source: 'openrouter',
          description: ((item.description as string) || '').substring(0, 300),
        },
      })
    }

    return {
      source: 'openrouter',
      status: 'success',
      data: { models, total_models: models.length, categories },
    }
  } catch (e) {
    return { source: 'openrouter', status: 'error', reason: String(e) }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  collect().then((result) => {
    console.log(`Status: ${result.status}`)
    if (result.status === 'success' && result.data) {
      console.log(`Total models: ${result.data.total_models}`)
      console.log(`Categories: ${result.data.categories}`)
    }
  })
}
```

---

## File: src/scan.ts

```typescript
/**
 * AI Landscape Scanner — the main script you run daily.
 *
 * Collects rankings from all sources, compares against yesterday,
 * and flags what changed. Outputs JSON + markdown report.
 *
 * Usage:
 *     npx tsx src/scan.ts              # Normal scan
 *     npx tsx src/scan.ts --force      # Force re-collect
 *     npx tsx src/scan.ts --dry-run    # Print without writing
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import { collect as collectLmarena } from './collectors/lmarena.js'
import { collect as collectTtsArena } from './collectors/tts_arena.js'
import { collect as collectSttLeaderboard } from './collectors/stt_leaderboard.js'
import { collect as collectOpenrouter } from './collectors/openrouter.js'
import { initDb, writeAiModels, writeScanLog, CollectorResult } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SCRIPT_DIR = __dirname
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..')
const OUTPUT_PATH = resolve(PROJECT_ROOT, 'data', 'ai-scan-latest.json')
const REPORT_DIR = resolve(PROJECT_ROOT, 'output', 'reports')

const ELO_SHIFT_THRESHOLD = 50
const TOP_N = 10

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

async function collectAll(conn: Database.Database, today: string): Promise<void> {
  const collectors = [
    { name: 'lmarena', fn: collectLmarena },
    { name: 'tts_arena', fn: collectTtsArena },
    { name: 'stt_leaderboard', fn: collectSttLeaderboard },
    { name: 'openrouter', fn: collectOpenrouter },
  ]

  for (const { name, fn } of collectors) {
    try {
      const result = (await fn()) as CollectorResult
      if (result.status === 'success') {
        const records = writeAiModels(conn, result, today)
        console.error(`  ${name}: ${records} records`)
      } else {
        console.error(`  ${name}: ${result.status} — ${result.reason || ''}`)
      }
    } catch (e) {
      console.error(`  ${name}: exception — ${e}`)
    }
  }
}

function getRankings(
  conn: Database.Database,
  date: string
): Record<string, Array<Record<string, unknown>>> {
  const rows = conn
    .prepare(
      `
    SELECT category, model_name, elo_score, provider, source, rank_in_category 
    FROM ai_models WHERE date = ? AND elo_score IS NOT NULL 
    ORDER BY category, rank_in_category
  `
    )
    .all(date) as Array<[string, string, number, string, string, number]>

  const rankings: Record<string, Array<Record<string, unknown>>> = {}
  for (const r of rows) {
    const cat = r[0]
    if (!rankings[cat]) rankings[cat] = []
    if (rankings[cat].length < TOP_N) {
      rankings[cat].push({
        model_name: r[1],
        elo_score: r[2],
        provider: r[3],
        source: r[4],
        rank: r[5],
      })
    }
  }
  return rankings
}

function detectChanges(
  current: Record<string, Array<Record<string, unknown>>>,
  previous: Record<string, Array<Record<string, unknown>>>
): Array<Record<string, unknown>> {
  const changes: Array<Record<string, unknown>> = []
  const allCats = new Set([...Object.keys(current), ...Object.keys(previous)])

  for (const cat of Array.from(allCats).sort()) {
    const curr = current[cat] || []
    const prev = previous[cat] || []

    if (!prev.length && curr.length) {
      changes.push({
        category: cat,
        type: 'new_category',
        detail: `New category with ${curr.length} models`,
        model: curr[0]?.model_name || null,
        elo: curr[0]?.elo_score || null,
      })
      continue
    }

    if (!curr.length) continue

    if (curr[0]?.model_name !== (prev[0]?.model_name || '')) {
      changes.push({
        category: cat,
        type: 'new_leader',
        detail: `${curr[0].model_name} overtook ${prev[0]?.model_name || 'N/A'}`,
        model: curr[0].model_name,
        elo: curr[0].elo_score,
      })
    }

    const prevNames = new Set(prev.map((m) => m.model_name))
    for (const m of curr) {
      if (!prevNames.has(m.model_name)) {
        const scoreStr = m.elo_score ? ` (ELO: ${Math.round(m.elo_score as number)})` : ''
        changes.push({
          category: cat,
          type: 'new_model',
          detail: `New in top ${TOP_N}: ${m.model_name}${scoreStr}`,
          model: m.model_name,
          elo: m.elo_score,
        })
      }
    }

    const prevByName: Record<string, Record<string, unknown>> = {}
    for (const p of prev) {
      prevByName[p.model_name as string] = p
    }
    for (const m of curr) {
      const pm = prevByName[m.model_name as string]
      if (pm && m.elo_score && pm.elo_score) {
        const shift = (m.elo_score as number) - (pm.elo_score as number)
        if (Math.abs(shift) >= ELO_SHIFT_THRESHOLD) {
          const direction = shift > 0 ? 'up' : 'down'
          changes.push({
            category: cat,
            type: 'elo_shift',
            detail: `${m.model_name} ${direction} by ${Math.abs(shift)}`,
            model: m.model_name,
            elo: m.elo_score,
          })
        }
      }
    }
  }

  return changes
}

function formatScore(category: string, score: number | null): string {
  if (score === null) return '—'
  if (category === 'speech-to-text') return `${Math.abs(score).toFixed(1)}% WER`
  return `${Math.round(score)}`
}

function writeReport(
  scanDate: string,
  current: Record<string, Array<Record<string, unknown>>>,
  changes: Array<Record<string, unknown>>,
  comparedTo: string | null
): string {
  mkdirSync(REPORT_DIR, { recursive: true })
  const path = resolve(REPORT_DIR, `${scanDate}.md`)

  const lines: string[] = [
    `# AI Landscape Report — ${scanDate}`,
    '',
    `> Compared against: ${comparedTo || 'N/A (first scan)'}`,
    '',
  ]

  if (changes.length) {
    lines.push('## Changes Detected', '')
    for (const c of changes) {
      lines.push(`- **${c.category}** [${c.type}]: ${c.detail}`)
    }
    lines.push('')
  } else {
    lines.push('## No Changes', '', 'All rankings stable.', '')
  }

  lines.push('## Current Leaders', '')
  lines.push('| Category | #1 Model | Provider | Score |')
  lines.push('|----------|----------|----------|-------|')
  for (const cat of Object.keys(current).sort()) {
    if (current[cat].length > 0) {
      const m = current[cat][0]
      lines.push(
        `| ${cat} | ${m.model_name} | ${m.provider} | ${formatScore(cat, m.elo_score as number)} |`
      )
    }
  }
  lines.push('')

  for (const cat of Object.keys(current).sort()) {
    const models = current[cat]
    const metric = cat === 'speech-to-text' ? 'WER' : 'ELO'
    lines.push(`### ${cat.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`, '')
    lines.push(`| # | Model | ${metric} | Provider |`)
    lines.push('|---|-------|-------|----------|')
    for (const m of models) {
      lines.push(
        `| ${m.rank || '—'} | ${m.model_name} | ${formatScore(cat, m.elo_score as number)} | ${m.provider || '—'} |`
      )
    }
    lines.push('')
  }

  writeFileSync(path, lines.join('\n'))
  console.error(`  Report: ${path}`)
  return path
}

interface ScanResult {
  scan_date: string
  compared_to: string | null
  has_changes: boolean
  summary: string
  changes: Array<Record<string, unknown>>
  categories_scanned: string[]
  total_models: number
  duration_seconds: number
  recommendation?: string
}

async function scan(options: { force?: boolean; dryRun?: boolean } = {}): Promise<ScanResult> {
  const start = Date.now()
  const conn = initDb()
  const today = getToday()

  console.error(`[${today}] AI Landscape scan starting...`)

  const hasData =
    (
      conn.prepare('SELECT COUNT(*) FROM ai_models WHERE date = ?').get(today) as {
        'COUNT(*)': number
      }
    )['COUNT(*)'] > 0
  if (options.force || !hasData) {
    console.error('  Collecting fresh data...')
    await collectAll(conn, today)
  }

  const current = getRankings(conn, today)
  if (!Object.keys(current).length) {
    conn.close()
    return {
      scan_date: today,
      compared_to: null,
      has_changes: false,
      summary: 'No data collected — check your internet connection',
      changes: [],
      categories_scanned: [],
      total_models: 0,
      duration_seconds: 0,
    }
  }

  const prevRow = conn
    .prepare('SELECT DISTINCT date FROM ai_models WHERE date < ? ORDER BY date DESC LIMIT 1')
    .get(today) as { date: string } | undefined
  const prevDate = prevRow?.date || null
  const previous = prevDate ? getRankings(conn, prevDate) : {}

  const changes = detectChanges(current, previous)
  const duration = (Date.now() - start) / 1000

  const leaders = changes.filter((c) => c.type === 'new_leader')
  const newModels = changes.filter((c) => c.type === 'new_model')
  const shifts = changes.filter((c) => c.type === 'elo_shift')

  const parts: string[] = []
  if (leaders.length) {
    for (const c of leaders) {
      parts.push(`New #1 in ${c.category}: ${c.detail}`)
    }
  }
  if (newModels.length) {
    parts.push(`${newModels.length} new model(s) in top rankings`)
  }
  if (shifts.length) {
    parts.push(`${shifts.length} significant score shift(s)`)
  }
  const summary = parts.length ? parts.join('; ') : 'No significant changes detected.'

  const result: ScanResult = {
    scan_date: today,
    compared_to: prevDate,
    has_changes: changes.length > 0,
    summary,
    changes,
    categories_scanned: Object.keys(current),
    total_models: Object.values(current).reduce((sum, arr) => sum + arr.length, 0),
    duration_seconds: Math.round(duration * 10) / 10,
  }

  if (changes.length) {
    const cats = Array.from(new Set(changes.map((c) => c.category))).sort()
    result.recommendation = `Run: /update-ai-docs ${cats.join(' ')}`
  }

  if (!options.dryRun) {
    writeScanLog(
      conn,
      today,
      'daily_scan',
      Object.keys(current).join(','),
      newModels.length,
      leaders.length + shifts.length,
      summary,
      duration
    )
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
    writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2))
    writeReport(today, current, changes, prevDate)
  }

  conn.close()
  console.error(`[${today}] Done: ${summary} (${duration.toFixed(1)}s)`)
  return result
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const dryRun = args.includes('--dry-run')

scan({ force, dryRun }).then((result) => {
  console.log(JSON.stringify(result, null, 2))
})
```

---

## File: .claude/commands/update-ai-docs.md

````markdown
# Update AI Docs

> Deep-dive research on changed AI model categories. Uses Claude Code agents to research new leaders, update docs with pricing, integration code, and community sentiment.

## Variables

target: $ARGUMENTS (optional — specific category like "code" or "text". If empty, checks all.)

## Instructions

Run this pipeline autonomously — zero stops, zero prompts.

### Phase 1: PULL LIVE RANKINGS

For each category, fetch the current leaderboard via WebFetch:

**Tier 1 (LMArena — 8 categories):**

```
WebFetch https://arena.ai/leaderboard/{category}
Prompt: "Extract the leaderboard table. For each model: rank, model name, ELO score, votes, provider. Top 20."
```

**Tier 2 — TTS:**

```
WebFetch https://tts-agi-tts-arena-v2.hf.space/leaderboard
Prompt: "Extract TTS leaderboard. For each: rank, model name, ELO, win rate, votes."
```

**Tier 2 — STT:**

```
WebFetch https://voicewriter.io/speech-recognition-leaderboard
Prompt: "Extract STT comparison table. For each: name, WER, price per hour."
```

If a specific `target` was given, only fetch that category.

### Phase 2: READ CURRENT DOCS

For each `docs/{category}/state-of-the-art.md`, read and extract the documented leader from the `> Leader:` line. If no file exists, flag as `no_docs`.

### Phase 3: DIFF

Compare live #1 vs documented #1 per category. Build change list:

- `new_leader` — #1 changed
- `new_top3` — new model entered top 3
- `no_docs` — file doesn't exist

**If no changes → say "All docs current" and EXIT.**
**If target was given → always update that category.**

### Phase 4: RESEARCH (parallel agents)

For each changed category, spawn a parallel Task agent:

```
Research [MODEL] for [CATEGORY]. Currently #{RANK} on [SOURCE] with [SCORE].

Do NOT write files — return research only:
1. WebSearch: "[model] API pricing 2026", "[model] documentation"
2. WebSearch: "[model] review", "[model] vs [competitor]"
3. WebFetch: official API docs for model ID and integration code
4. WebSearch: "[model] reddit" for community sentiment

Return:
- Overview (2-3 sentences)
- Best for (3-4 bullets)
- Not ideal for (1-2 bullets)
- Pricing (exact $/unit)
- API Model ID (exact string)
- Integration code (Python, working, with SDK import)
- Community sentiment (2-3 sentences)
- Tips & gotchas (2-3 bullets)
```

Research top 2-3 models per changed category. Spawn agents in parallel.

### Phase 5: UPDATE DOCS

Write `docs/{category}/state-of-the-art.md` for each researched category:

```markdown
# [Category] — State of the Art

> Last updated: YYYY-MM-DD
> Source: [Leaderboard URL] | [vote count]+ votes
> Leader: [Model] ([Provider]) — ELO: [score] | [votes] votes

## Quick Pick

| Use Case | Best Model | Provider | API Model ID | Cost | ELO |
| -------- | ---------- | -------- | ------------ | ---- | --- |

## Rankings (Top 10)

| #   | Model | Provider | ELO | Votes |
| --- | ----- | -------- | --- | ----- |

## Top Models — Deep Dive

### 1. [Model] — [Provider]

[Overview, specs, integration code, tips]
```

Then update `docs/README.md` with current leaders across all categories.

### Phase 6: REPORT

Output: categories checked, changes found, docs updated.
````

---

## Step 6: Set Up the Daily Cron Job

### macOS (launchd) — recommended

Create `~/Library/LaunchAgents/com.ai-landscape-tracker.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ai-landscape-tracker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/ai-landscape-tracker/node_modules/.bin/tsx</string>
        <string>/path/to/ai-landscape-tracker/src/scan.ts</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>6</integer>
        <key>Minute</key>
        <integer>30</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/path/to/ai-landscape-tracker/data/scan.log</string>
    <key>StandardErrorPath</key>
    <string>/path/to/ai-landscape-tracker/data/scan.log</string>
    <key>WorkingDirectory</key>
    <string>/path/to/ai-landscape-tracker</string>
</dict>
</plist>
```

Then load it:

```bash
# Replace /path/to/ with your actual project path first!
launchctl load ~/Library/LaunchAgents/com.ai-landscape-tracker.plist
```

### Linux (cron)

```bash
crontab -e
# Add this line (adjust paths):
30 6 * * * cd /path/to/ai-landscape-tracker && npx tsx src/scan.ts >> data/scan.log 2>&1
```

### Windows (Task Scheduler)

```powershell
# Create a scheduled task
$action = New-ScheduledTaskAction -Execute "node" -Argument "node_modules\tsx\dist\cli.js src\scan.ts" -WorkingDirectory "C:\path\to\ai-landscape-tracker"
$trigger = New-ScheduledTaskTrigger -Daily -At 6:30AM
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "AI Landscape Tracker" -Description "Daily AI model leaderboard scan"
```

---

## Step 7: Test It

```bash
cd ai-landscape-tracker
npm install

# Run your first scan
npx tsx src/scan.ts

# Check the output
cat data/ai-scan-latest.json

# Check the report
ls output/reports/
```

You should see rankings for all 10 categories. Run it again tomorrow and it'll tell you what changed.

---

## Step 8: Deep Dive Research (Claude Code)

When the scanner detects changes, use Claude Code:

```
/update-ai-docs text
```

This spawns research agents that investigate the new leaders, update your docs with pricing, working API code, and community sentiment. Costs ~$1-3 per category.

---

## How to Extend This

**Add it to a daily digest:** Read `data/ai-scan-latest.json` in any morning briefing script. The `has_changes`, `summary`, and `changes` fields give you everything.

**Track trends over time:** The SQLite database stores daily snapshots. Query historical data:

```sql
-- Which model has been #1 in text the longest?
SELECT model_name, COUNT(*) as days_at_top
FROM ai_models
WHERE category = 'text' AND rank_in_category = 1
GROUP BY model_name
ORDER BY days_at_top DESC;

-- When did the last leader change happen in code?
SELECT a.date, a.model_name as new_leader, b.model_name as old_leader
FROM ai_models a
JOIN ai_models b ON b.date = (
    SELECT MAX(date) FROM ai_models WHERE date < a.date AND category = 'code' AND rank_in_category = 1
) AND b.category = 'code' AND b.rank_in_category = 1
WHERE a.category = 'code' AND a.rank_in_category = 1
AND a.model_name != b.model_name
ORDER BY a.date DESC LIMIT 5;
```

**Add more sources:** The collector pattern is simple — any TypeScript async function that returns `{ source: "name", status: "success", data: { models: [...] } }` works. Just drop it in `src/collectors/` and add it to the scanner.

---

## Package.json Reference

```json
{
  "name": "ai-landscape-tracker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "scan": "tsx src/scan.ts",
    "scan:force": "tsx src/scan.ts --force",
    "test": "tsx src/scan.ts --dry-run"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "better-sqlite3": "^9.0.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

_Built by Liam Ottley. This is one system inside the AI Operating System I use to run a 50-person company across 4 businesses. More at [youtube.com/@LiamOttley](https://youtube.com/@LiamOttley)_
