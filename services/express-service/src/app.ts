import 'dotenv/config'
import express from 'express'
import { initAdminAuth } from 'firebase-auth/admin'
import routes from './routes/index.js'

initAdminAuth()

export function createApp(): express.Application {
  const app = express()
  app.use(express.json())
  app.use(routes)
  return app
}
