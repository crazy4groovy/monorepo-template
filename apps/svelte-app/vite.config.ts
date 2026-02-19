import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    sveltekit(),
    process.env.NODE_ENV === 'production'
      ? visualizer({
          filename: './build/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap',
        })
      : false,
  ].filter(Boolean),
  resolve: {
    alias: {
      package1:
        process.env.NODE_ENV === 'development'
          ? path.resolve(__dirname, '../../packages/package1/src/index.ts')
          : 'package1',
    },
  },
})
