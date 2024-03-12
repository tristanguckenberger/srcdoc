// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ params, cookies, request }) {
	const { slug } = params;
	console.log('slug::', slug);
	const requestHeaders = new Headers();
	const token = cookies.get('token');
	const body = await request.json();

	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	const requestInit = {
		method: 'PUT',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(body)
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/${slug}`, requestInit);

	const result = await response.json();

	console.log('result::', result);

	// Return a response
	return json(result);
}
