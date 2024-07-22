// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params, url }) {
	const { userId } = params;
	const limit = url.searchParams.get('limit') || 20;
	const offset = url.searchParams.get('offset') || 0;

	const requestHeaders = new Headers();
	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/userActivities/users/${userId}/activities?limit=${limit}&offset=${offset}`,
		requestInit
	);
	const result = await response.json();
	return json(result);
}
