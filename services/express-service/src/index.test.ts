import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from './app.js'
import * as todosService from './services/todos.service.js'

describe('Express Service', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    todosService.reset()
    app = createApp()
  })

  describe('GET /', () => {
    it('should return hello message with examples', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('Express Service')
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

  describe('Todos API', () => {
    describe('GET /api/todos', () => {
      it('should return empty list initially', async () => {
        const response = await request(app).get('/api/todos')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ todos: [] })
      })
    })

    describe('POST /api/todos', () => {
      it('should create a todo', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send({ title: 'Buy milk' })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
          title: 'Buy milk',
          completed: false,
        })
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('createdAt')
      })

      it('should reject empty title', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send({ title: '' })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
      })
    })

    describe('GET /api/todos/:id', () => {
      it('should return a todo by id', async () => {
        const createRes = await request(app)
          .post('/api/todos')
          .send({ title: 'Test todo' })
        const { id } = createRes.body

        const response = await request(app).get(`/api/todos/${id}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
          id,
          title: 'Test todo',
          completed: false,
        })
      })

      it('should return 404 for unknown id', async () => {
        const response = await request(app).get('/api/todos/nonexistent')

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
      })
    })

    describe('PATCH /api/todos/:id', () => {
      it('should update a todo', async () => {
        const createRes = await request(app)
          .post('/api/todos')
          .send({ title: 'Original' })
        const { id } = createRes.body

        const response = await request(app)
          .patch(`/api/todos/${id}`)
          .send({ title: 'Updated', completed: true })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
          id,
          title: 'Updated',
          completed: true,
        })
      })
    })

    describe('DELETE /api/todos/:id', () => {
      it('should delete a todo', async () => {
        const createRes = await request(app)
          .post('/api/todos')
          .send({ title: 'To delete' })
        const { id } = createRes.body

        const deleteRes = await request(app).delete(`/api/todos/${id}`)
        expect(deleteRes.status).toBe(204)

        const getRes = await request(app).get(`/api/todos/${id}`)
        expect(getRes.status).toBe(404)
      })
    })
  })
})
