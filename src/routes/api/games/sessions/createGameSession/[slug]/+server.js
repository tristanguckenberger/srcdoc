// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ cookies, params }) {
	const { slug } = params;
	const token = cookies.get('token') ?? localStorage?.getItem('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'POST',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/sessions/games/${slug}/create`,
		requestInit
	);

	const result = await response.json();

	// Return a response
	return json(result);
}
