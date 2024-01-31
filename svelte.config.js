import adapter from '@sveltejs/adapter-auto';
import { VitePWA } from 'vite-plugin-pwa';
import * as dotenv from 'dotenv';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
	vite: {
		plugins: [
			VitePWA({
				registerType: 'autoUpdate',
				// includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
				manifest: {
					// Manifest configuration
					name: 'Play Engine',
					start_url: '/',
					display: 'standalone',
					share_target: {
						action: '/share-target',
						method: 'POST',
						enctype: 'multipart/form-data',
						params: {
							title: 'name',
							text: 'description',
							url: 'link'
						}
					},
					background_color: '#ffffff',
					description: 'A description of your app.'
					//   icons: [
					// 	{
					// 	  src: 'path/to/your/icon.png',
					// 	  sizes: '192x192',
					// 	  type: 'image/png'
					// 	},
					// 	// Other icons
					//   ]
				}
			})
		]
	}
};

dotenv.config();

export default config;
