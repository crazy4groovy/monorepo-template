import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // @ts-expect-error - Vite version mismatch between plugins and Vite 7.2.4, but works correctly at runtime
    react(),
    // Only add visualizer during build (not dev/test)
    ...(process.env.NODE_ENV === 'production'
      ? [
          visualizer({
            filename: './dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap', // 'sunburst' | 'treemap' | 'network'
          }),
        ]
      : []),
  ],
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
