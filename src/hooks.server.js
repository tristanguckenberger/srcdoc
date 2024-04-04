// import { session } from '$lib/stores/sessionStore';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event?.url?.search === '?/logout') {
		event?.setHeaders({
			'Clear-Site-Data': '"*"'
		});
	}

	return await resolve(event);
}
