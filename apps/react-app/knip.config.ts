import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['dist/**', 'node_modules/**', 'src/routeTree.gen.ts'],
  ignoreDependencies: ['package1'],
}

export default config
