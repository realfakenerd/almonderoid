import adapter from '@sveltejs/adapter-static';
import viteCompression from 'vite-plugin-compression';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			precompress: true
		}),
		prerender: {
			default: true
		},
		vite: {
			build: {
				reportCompressedSize: true,
				target: 'esnext',
				minify: 'esbuild',
			},
			plugins: [
				viteCompression({
					algorithm: 'brotliCompress',
					verbose: true,
					threshold: 512,
					compressionOptions: {
						level: 3
					}
				})
			]
		}
	}
};

export default config;
