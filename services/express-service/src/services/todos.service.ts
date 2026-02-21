import type { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo.js'

const todos = new Map<string, Todo>()

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function findAll(): Todo[] {
  return Array.from(todos.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

export function findById(id: string): Todo | undefined {
  return todos.get(id)
}

export function create(input: CreateTodoInput): Todo {
  const id = generateId()
  const todo: Todo = {
    id,
    title: input.title,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  todos.set(id, todo)
  return todo
}

export function update(id: string, input: UpdateTodoInput): Todo | undefined {
  const existing = todos.get(id)
  if (!existing) return undefined

  const updated: Todo = {
    ...existing,
    ...(input.title !== undefined && { title: input.title }),
    ...(input.completed !== undefined && { completed: input.completed }),
  }
  todos.set(id, updated)
  return updated
}

export function remove(id: string): boolean {
  return todos.delete(id)
}

/** Clears all todos. Used in tests to isolate state. */
export function reset(): void {
  todos.clear()
}
