import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

describe('Counter', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the counter', () => {
    render(<Counter />)
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    const incrementButton = screen.getByText(/Increment/i)

    await user.click(incrementButton)
    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument()
  })
})
