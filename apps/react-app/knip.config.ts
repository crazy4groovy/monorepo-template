import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['dist/**', 'node_modules/**'],
  ignoreDependencies: [
    // Workspace dependency
    'package1',
  ],
}

export default config
