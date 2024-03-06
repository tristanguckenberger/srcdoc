// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	const token = cookies.get('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'POST',
		headers: requestHeaders
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/create`, requestInit);

	const result = await response.json();

	// Return a response
	return json(result);
}
