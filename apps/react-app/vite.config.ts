import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
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
