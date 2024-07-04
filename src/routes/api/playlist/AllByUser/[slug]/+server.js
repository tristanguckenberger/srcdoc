// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { slug } = params;

	const requestHeaders = new Headers();
	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/user/${slug}`, requestInit);
	const result = await response.json();
	return json(result);
}
