import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

const config = {
	define: {
		'process.env': {}
	},
	build: {
		reportCompressedSize: false,
		target: 'esnext',
		minify: 'esbuild'
	},
	plugins: [
		sveltekit(),
		viteCompression({
			algorithm: 'brotliCompress',
			verbose: false,
			threshold: 512,
			compressionOptions: {
				level: 3
			}
		})
	]
} satisfies UserConfig;

export default config;