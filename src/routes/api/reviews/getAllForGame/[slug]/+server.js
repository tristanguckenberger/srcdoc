// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	// const requestHeaders = new Headers();

	// requestHeaders.append('Content-Type', 'application/json');

	// const requestInit = {
	// 	method: 'GET',
	// 	headers: requestHeaders
	// };

	const { slug } = params;

	const response = await fetch(`${process.env.SERVER_URL}/api/reviews/games/${slug}`);

	const result = await response.json();
	return json(result);
}
