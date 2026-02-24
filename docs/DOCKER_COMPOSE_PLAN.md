# Docker Compose Implementation Plan

## Overview

Add **Docker Compose** for local development orchestration.

## Why Docker Compose?

- One-command startup
- Consistent environment for all devs
- Production-like architecture

---

## Implementation

### 1. Create `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: mono
      POSTGRES_PASSWORD: mono
      POSTGRES_DB: mono_template
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U mono']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  mailhog:
    image: mailhog/mailhog
    ports:
      - '1025:1025'
      - '8025:8025'

volumes:
  postgres_data:
  redis_data:
```

### 2. Create Dockerfile.dev

```
services/express-service/
├── Dockerfile
├── Dockerfile.dev
└── .dockerignore
```

```dockerfile
FROM node:22-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
```

### 3. Add Scripts

In root `package.json`:

```json
{
  "scripts": {
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f"
  }
}
```

### 4. Create `.dockerignore`

```
node_modules
dist
.turbo
.git
.env
```

---

## Services

| Service  | Port | URL                                 |
| -------- | ---- | ----------------------------------- |
| Postgres | 5432 | postgres://mono:mono@localhost:5432 |
| Redis    | 6379 | redis://localhost:6379              |
| Mailhog  | 1025 | localhost:1025                      |

---

## Validate

```bash
pnpm docker:up
pnpm docker:down
```

---

## Future Enhancements

- LocalStack for AWS mocking
- nginx reverse proxy
- Monitoring (Prometheus, Grafana)
