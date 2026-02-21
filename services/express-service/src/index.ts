import { createApp } from './app.js'

const app = createApp()
const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'Express Service'
const API_VERSION = process.env.API_VERSION || 'v1'

const server = app.listen(PORT, () => {
  console.log(`${APP_NAME} (${API_VERSION}) running on http://localhost:${PORT}`)
})

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
