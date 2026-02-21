# Routes

Route definitions. Maps HTTP methods and paths to controllers.

## Modules

### `services/express-service/src/routes/index.ts`

Main router. Mounts all routes at root.

- `GET /` → homeController.getHome
- `GET /health` → homeController.getHealth
- `GET /api/protected` → authMiddleware → authController.getProtected
- `GET/POST /api/todos`, `GET/PATCH/DELETE /api/todos/:id` → todosRoutes

### `services/express-service/src/routes/todos.routes.ts`

Todo CRUD routes mounted at `/api/todos`.

- `GET /` → list
- `GET /:id` → getOne
- `POST /` → create
- `PATCH /:id` → update
- `DELETE /:id` → remove
