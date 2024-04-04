// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const requestHeaders = new Headers();
	const token = cookies.get('token');

	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	const requestInit = {
		method: 'GET',
		headers: requestHeaders
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/get/library`, requestInit);

	const result = await response.json();
	return json(result);
}
