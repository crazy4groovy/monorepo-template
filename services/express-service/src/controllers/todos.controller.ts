import type { Request, Response } from 'express'
import * as todosService from '../services/todos.service.js'

export function list(_req: Request, res: Response): void {
  const todos = todosService.findAll()
  res.json({ todos })
}

export function getOne(req: Request, res: Response): void {
  const todo = todosService.findById(req.params.id as string)
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  res.json(todo)
}

export function create(req: Request, res: Response): void {
  const { title } = req.body
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' })
    return
  }
  const todo = todosService.create({ title: title.trim() })
  res.status(201).json(todo)
}

export function update(req: Request, res: Response): void {
  const todo = todosService.update(req.params.id as string, req.body)
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  res.json(todo)
}

export function remove(req: Request, res: Response): void {
  const deleted = todosService.remove(req.params.id as string)
  if (!deleted) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  res.status(204).send()
}
