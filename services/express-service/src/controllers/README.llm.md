# Controllers

HTTP request handlers. Controllers receive `req`/`res`, call services for business logic, and send responses.

## Modules

### `services/express-service/src/controllers/home.controller.ts`

- **getHome** — `GET /` — Returns welcome message with app info and package1 utility examples
- **getHealth** — `GET /health` — Returns `{ status: 'ok' }`

### `services/express-service/src/controllers/auth.controller.ts`

- **getProtected** — `GET /api/protected` — Returns `{ uid }` from Firebase-decoded user (requires authMiddleware)

### `services/express-service/src/controllers/todos.controller.ts`

- **list** — `GET /api/todos` — Returns `{ todos: Todo[] }`
- **getOne** — `GET /api/todos/:id` — Returns todo or 404
- **create** — `POST /api/todos` — Body: `{ title }`, returns 201 + todo or 400
- **update** — `PATCH /api/todos/:id` — Body: `{ title?, completed? }`, returns todo or 404
- **remove** — `DELETE /api/todos/:id` — Returns 204 or 404
