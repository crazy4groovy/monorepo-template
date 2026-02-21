import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    alias: {
      // More specific first so 'firebase-auth/client/svelte' doesn't resolve as client + /svelte
      'firebase-auth/client/svelte': path.resolve(
        __dirname,
        '../../packages/firebase-auth/src/client/svelte.ts'
      ),
      'firebase-auth/client': path.resolve(
        __dirname,
        '../../packages/firebase-auth/src/client/index.ts'
      ),
    },
    // Use static adapter for SPA (client-only) mode
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    // Disable SSR - client-only SPA
    prerender: {
      entries: [],
    },
  },
}

export default config
