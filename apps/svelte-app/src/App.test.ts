import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import App from './App.svelte'

describe('App', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the app name', async () => {
    render(App)
    const heading = await screen.findByRole('heading', {
      name: /Svelte App/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('displays package1 utilities', async () => {
    render(App)
    expect(await screen.findByText(/Capitalize: Hello world/i)).toBeInTheDocument()
    expect(await screen.findByText(/Add: 5 \+ 3 = 8/i)).toBeInTheDocument()
  })
})
