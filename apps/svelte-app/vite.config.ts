import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
      hot: !process.env.VITEST,
      emitCss: false,
    }),
  ],
  resolve: {
    alias: {
      // Resolve package1 from source in development for instant updates
      package1:
        process.env.NODE_ENV === 'development'
          ? path.resolve(__dirname, '../../packages/package1/src/index.ts')
          : 'package1',
    },
    conditions: process.env.VITEST ? ['browser', 'module', 'import'] : undefined,
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
