// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { userId } = params;

	const requestHeaders = new Headers();
	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/userActivities/users/${userId}/activities`,
		requestInit
	);
	const result = await response.json();
	console.log('result::', result);
	return json(result);
}
