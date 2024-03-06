// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { slug } = params;
	console.log('GET::slug::', slug);
	const requestHeaders = new Headers();

	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/user/${slug}`, requestInit);

	const result = await response.json();

	console.log('result::', result);

	// Return a response
	return json(result);
}
