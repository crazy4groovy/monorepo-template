import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.ts'],
  project: ['src/**/*.{ts,svelte}'],
  ignore: ['dist/**', 'node_modules/**'],
  ignoreDependencies: [
    // Workspace dependency
    'package1',
  ],
}

export default config
