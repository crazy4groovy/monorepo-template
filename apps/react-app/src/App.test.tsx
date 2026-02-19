import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { add, capitalize, formatCurrency } from 'package1'

const createTestRouter = () => {
  const history = createMemoryHistory({
    initialEntries: ['/'],
  })
  return createRouter({ routeTree, history })
}

describe('Home Route', () => {
  it('should render the app title', async () => {
    const router = createTestRouter()
    render(<RouterProvider router={router} />)
    await waitFor(() => {
      expect(screen.getByText('React App')).toBeInTheDocument()
    })
  })

  it('should render welcome message', async () => {
    const router = createTestRouter()
    render(<RouterProvider router={router} />)
    await waitFor(() => {
      expect(screen.getByText(/Welcome to the React app in the monorepo!/)).toBeInTheDocument()
    })
  })

  it('should display package1 utilities', async () => {
    const router = createTestRouter()
    render(<RouterProvider router={router} />)
    await waitFor(() => {
      expect(screen.getByText(/Using package1 utilities:/)).toBeInTheDocument()
      expect(screen.getByText(/Capitalize: Hello world/)).toBeInTheDocument()
      expect(screen.getByText(/Add: 5 \+ 3 = 8/)).toBeInTheDocument()
    })
  })
})

describe('package1 integration', () => {
  it('should use capitalize function correctly', () => {
    expect(capitalize('hello world')).toBe('Hello world')
  })

  it('should use add function correctly', () => {
    expect(add(5, 3)).toBe(8)
  })

  it('should use formatCurrency function correctly', () => {
    const formatted = formatCurrency(1234.56)
    expect(formatted).toContain('1,234.56')
  })
})
