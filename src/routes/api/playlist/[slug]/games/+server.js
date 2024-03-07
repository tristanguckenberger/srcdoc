// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params, cookies }) {
	const { slug } = params;
	console.log('slug::', slug);
	const requestHeaders = new Headers();
	const token = cookies.get('token');

	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/${slug}/games`, requestInit);

	const result = await response.json();

	console.log('result::', result);

	// Return a response
	return json(result);
}
