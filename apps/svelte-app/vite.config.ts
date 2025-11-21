import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Only add visualizer during build (not dev/test)
		...(process.env.NODE_ENV === 'production'
			? [
					visualizer({
						filename: './build/stats.html',
						open: false,
						gzipSize: true,
						brotliSize: true,
						template: 'treemap', // 'sunburst' | 'treemap' | 'network'
					}),
				]
			: []),
	],
	resolve: {
		alias: {
			// Resolve package1 from source in development for instant updates
			package1:
				process.env.NODE_ENV === 'development'
					? path.resolve(__dirname, '../../packages/package1/src/index.ts')
					: 'package1',
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		mockReset: true,
		restoreMocks: true,
		clearMocks: true,
	},
});
