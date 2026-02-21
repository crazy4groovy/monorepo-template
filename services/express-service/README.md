# Express Service

Express API service with **MVC architecture** (controllers, services, routes separated).

## Structure

```
src/
├── app.ts           # App factory
├── index.ts         # Entry point
├── controllers/     # HTTP handlers
├── services/        # Business logic
├── routes/          # Route definitions
└── types/           # Shared types
```

## API

| Method | Path           | Description                              |
| ------ | -------------- | ---------------------------------------- |
| GET    | /              | Welcome + package1 examples              |
| GET    | /health        | Health check                             |
| GET    | /api/protected | Firebase-protected (auth required)       |
| GET    | /api/todos     | List todos                               |
| GET    | /api/todos/:id | Get todo                                 |
| POST   | /api/todos     | Create todo `{ "title": "..." }`         |
| PATCH  | /api/todos/:id | Update todo `{ "title"?, "completed"? }` |
| DELETE | /api/todos/:id | Delete todo                              |

## Setup

```bash
cp .env.sample .env
# Edit .env with your values
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — Development with watch
- `pnpm build` — Build for production
- `pnpm start` — Run production build
- `pnpm test` — Run tests
- `pnpm lint` — Lint
