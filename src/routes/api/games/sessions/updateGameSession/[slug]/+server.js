// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies, params }) {
	const { slug } = params;
	const token = cookies.get('token') ?? localStorage?.getItem('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	//get the body of the request
	const body = await request.json();

	console.log('request::', body);

	const requestInit = {
		method: 'PUT',
		headers: requestHeaders,
		//add the body to the request
		body: JSON.stringify(body)
	};

	const response = await fetch(`${process.env.SERVER_URL}/api/sessions/${slug}`, requestInit);

	const result = await response.json();

	// Return a response
	return json(result);
}
