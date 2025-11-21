import '@testing-library/jest-dom'
import { configure } from '@testing-library/svelte'
import { cleanup } from '@testing-library/svelte'
import { afterEach } from 'vitest'

// Configure Testing Library defaults
configure({
  // Use data-test-id attribute for queries
  testIdAttribute: 'data-test-id',
  // Timeout for async queries (findBy*, waitFor, etc.)
  asyncUtilTimeout: 1000,
  // Include hidden elements in queries by default (set to false to exclude)
  defaultHidden: false,
})

// Cleanup after each test (though Vitest handles this, this ensures DOM cleanup)
afterEach(() => {
  cleanup()
})
