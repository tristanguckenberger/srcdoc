// vitest.setup.js
import { vi } from 'vitest';

// Mock SvelteKit stores and environment
vi.mock('@sveltejs/kit', () => {
	return {
		page: {
			subscribe: (fn) => {
				fn({
					url: new URL('http://localhost/'),
					params: {},
					route: {
						id: null
					},
					status: 200,
					error: null
				});
				return () => {};
			}
		},
		session: {
			subscribe: (fn) => {
				fn({
					id: 1
				});
				return () => {};
			}
		},
		browser: true,
		afterNavigate: () => {},
		beforeNavigate: () => {}
	};
});
