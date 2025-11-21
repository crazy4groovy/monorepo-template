import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import express from 'express'
import { add, capitalize, formatCurrency } from 'package1'

// Create a test app similar to the main app
function createApp() {
  const app = express()
  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello from Express service!',
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

  return app
}

describe('Express Service', () => {
  let app: express.Application

  beforeEach(() => {
    app = createApp()
  })

  describe('GET /', () => {
    it('should return hello message with examples', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('Hello from Express service!')
      expect(response.body.example).toHaveProperty('capitalize')
      expect(response.body.example).toHaveProperty('add')
      expect(response.body.example).toHaveProperty('currency')
      expect(response.body.example.add).toBe(30)
    })
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ status: 'ok' })
    })
  })
})
