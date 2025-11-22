import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => (
    <>
      <h1>About</h1>
      <p>This is a simple React app using TanStack Router.</p>
      <p>It is a part of a monorepo template with multiple apps and packages.</p>
    </>
  ),
})
