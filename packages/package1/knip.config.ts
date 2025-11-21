import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  project: ['src/**/*.ts'],
  ignore: ['dist/**', 'node_modules/**'],
  // Library packages export everything, so we're more lenient
  ignoreExportsUsedInFile: true,
}

export default config
