# Express Service Source

Main source code for the Express API service.

## Modules

### `services/express-service/src/index.ts`

Express application entry point that sets up routes and starts the server.

**Exports**: None (side effects only - starts server)

**Functions**:

- Creates Express app instance
- Configures JSON middleware
- Defines routes
- Starts HTTP server
- Handles graceful shutdown

**Routes**:

- `GET /` - Returns welcome message with app info and package1 utility examples
  - Response: `{ message: string, version: string, example: { capitalize: string, add: number, currency: string } }`
- `GET /health` - Health check endpoint
  - Response: `{ status: 'ok' }`

**Environment Variables**:

- `PORT` - Server port (default: 3000)
- `APP_NAME` - Application name (default: 'Express Service')
- `API_VERSION` - API version (default: 'v1')

**Dependencies**:

- `express` - Express web framework
- `dotenv/config` - Loads environment variables
- `package1` - Uses `add`, `capitalize`, `formatCurrency` utilities

**Server Lifecycle**:

- Listens on configured PORT
- Handles `SIGTERM` signal for graceful shutdown
- Handles `SIGINT` signal (Ctrl+C) for graceful shutdown

**Gotchas**:

- Uses `dotenv/config` import to load environment variables automatically
- Server instance is stored for graceful shutdown handling
- Health check endpoint returns simple status object
- Root endpoint demonstrates package1 utilities in response

### `services/express-service/src/test/setup.ts`

Test configuration - see `services/express-service/src/test/README.llm.md` for details.

## Relationships

- Imports utilities from `package1` workspace package
- Uses Express middleware for JSON parsing
- Integrates with package1 for utility functions in API responses
