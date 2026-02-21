# Services

Business logic layer. Services contain pure logic with no HTTP concerns.

## Modules

### `services/express-service/src/services/todos.service.ts`

In-memory todo store. Data persists for the lifetime of the process.

**Exports**:

- **findAll()** — Returns all todos sorted by createdAt
- **findById(id)** — Returns todo or undefined
- **create(input)** — Creates todo, returns it
- **update(id, input)** — Updates todo, returns it or undefined
- **remove(id)** — Deletes todo, returns boolean
- **reset()** — Clears all todos (for tests)

**Types**: Uses `Todo`, `CreateTodoInput`, `UpdateTodoInput` from `../types/todo.js`
