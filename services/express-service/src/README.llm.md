# Express Service Source

Main source code for the Express API service. Uses **MVC architecture** with controllers, services, and routes separated.

## Architecture

```
src/
├── app.ts              # App factory (createApp)
├── index.ts            # Entry point, starts server
├── controllers/        # HTTP handlers (request/response)
├── services/           # Business logic
├── routes/             # Route definitions
├── types/              # Shared type definitions
└── test/               # Test setup
```

## Modules

### `services/express-service/src/app.ts`

Creates the Express application instance. Call `createApp()` to get a configured app (used by `index.ts` and tests).

**Exports**: `createApp(): express.Application`

**Dependencies**: dotenv, firebase-auth/admin (initAdminAuth), routes

### `services/express-service/src/index.ts`

Entry point. Creates app, starts HTTP server, handles graceful shutdown (SIGTERM, SIGINT).

**Exports**: None (side effects only)

### `services/express-service/src/controllers/`

HTTP request handlers. Controllers receive `req`/`res`, call services for business logic, and send responses.

- **home.controller.ts**: `getHome`, `getHealth` — root and health endpoints
- **auth.controller.ts**: `getProtected` — Firebase-protected route
- **todos.controller.ts**: `list`, `getOne`, `create`, `update`, `remove` — todo CRUD

### `services/express-service/src/services/`

Business logic layer. Services are pure functions (or modules) with no HTTP concerns.

- **todos.service.ts**: In-memory todo CRUD — `findAll`, `findById`, `create`, `update`, `remove`, `reset` (test helper)

### `services/express-service/src/routes/`

Route definitions. Maps HTTP methods/paths to controllers.

- **index.ts**: Main router — `/`, `/health`, `/api/protected`, `/api/todos`
- **todos.routes.ts**: Todo routes — `GET/POST /api/todos`, `GET/PATCH/DELETE /api/todos/:id`

### `services/express-service/src/types/`

Shared TypeScript types.

- **todo.ts**: `Todo`, `CreateTodoInput`, `UpdateTodoInput`

## Routes

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | / | home | Welcome message + package1 examples |
| GET | /health | home | Health check |
| GET | /api/protected | auth | Firebase-protected (requires auth) |
| GET | /api/todos | todos | List all todos |
| GET | /api/todos/:id | todos | Get one todo |
| POST | /api/todos | todos | Create todo |
| PATCH | /api/todos/:id | todos | Update todo |
| DELETE | /api/todos/:id | todos | Delete todo |

## Environment Variables

- `PORT` — Server port (default: 3000)
- `APP_NAME` — Application name (default: 'Express Service')
- `API_VERSION` — API version (default: 'v1')

## Relationships

- **Controllers** → call **Services** for business logic
- **Routes** → wire paths to **Controllers**
- **app.ts** → mounts **Routes**, initializes Firebase Admin Auth
- Uses `package1` for utilities (add, capitalize, formatCurrency)
- Uses `firebase-auth/admin` for protected routes
