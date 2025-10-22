import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	define: {
		'process.env': '{}'
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
});
