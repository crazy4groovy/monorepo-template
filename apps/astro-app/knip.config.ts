import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['dist/**', 'node_modules/**', '.astro/**'],
  ignoreDependencies: ['package1'],
}

export default config
