import 'dotenv/config'
import express from 'express'
import { add, capitalize, formatCurrency } from 'package1'

const app = express()
const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'Express Service'
const API_VERSION = process.env.API_VERSION || 'v1'

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: `Hello from ${APP_NAME}!`,
    version: API_VERSION,
    example: {
      capitalize: capitalize('hello world'),
      add: add(10, 20),
      currency: formatCurrency(99.99),
    },
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const server = app.listen(PORT, () => {
  console.log(`${APP_NAME} (${API_VERSION}) running on http://localhost:${PORT}`)
})

// Graceful shutdown handling for hot reload
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
