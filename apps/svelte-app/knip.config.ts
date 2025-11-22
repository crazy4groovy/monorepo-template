import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/routes/**/+{page,layout,error}.{js,ts,svelte}'],
  project: ['src/**/*.{ts,js,svelte}'],
  ignore: ['build/**', 'node_modules/**', '.svelte-kit/**'],
  ignoreDependencies: [
    // Workspace dependency
    'package1',
  ],
}

export default config
