import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/pages/**/*.{astro,tsx,ts}'],
  project: ['src/**/*.{ts,tsx,astro}'],
  ignore: ['dist/**', 'node_modules/**', '.astro/**'],
  ignoreDependencies: [
    // Workspace dependency
    'package1',
  ],
}

export default config
