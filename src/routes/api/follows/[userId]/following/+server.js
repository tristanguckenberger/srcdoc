// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { userId } = params;
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');

	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/follows/following/${userId}`,
		requestInit
	);

	const result = await response.json();

	return json(result);
}
