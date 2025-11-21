import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/index.ts'],
  project: ['src/**/*.ts'],
  ignore: ['dist/**', 'node_modules/**'],
  ignoreDependencies: [
    // Workspace dependency
    'package1',
  ],
}

export default config
