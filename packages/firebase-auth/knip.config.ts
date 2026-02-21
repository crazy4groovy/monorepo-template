import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  project: ['src/**/*.ts'],
  ignore: ['dist/**', 'node_modules/**'],
  ignoreExportsUsedInFile: true,
}

export default config
