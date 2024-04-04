// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ cookies, params }) {
	const token = cookies.get('token');
	const playlistSlug = params.slug;

	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'DELETE',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/playlist/${playlistSlug}`,
		requestInit
	);

	const result = await response.json();

	// Return a response
	return json(result);
}
