import { defineConfig } from 'vitest/config'
import react from '@astrojs/react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolve package1 from source in development for instant updates
      package1:
        process.env.NODE_ENV === 'development'
          ? path.resolve(__dirname, '../../packages/package1/src/index.ts')
          : 'package1',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
})
