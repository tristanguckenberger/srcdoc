// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies, params }) {
	const { slug } = params;
	const data = await request.json();
	const token = cookies.get('token') ?? localStorage?.getItem('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	const requestInit = {
		method: 'POST',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(data)
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/activities/${slug}/create`,
		requestInit
	);

	const result = await response.json();

	return json(result);
}
