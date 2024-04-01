//  @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders }) {
	const reqInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	let categories;

	try {
		const response = await fetch(`${process.env.SERVER_URL}/api/playlist/categories/all`, reqInit);

		if (!response.ok) {
			return json({
				status: 401,
				body: {
					message: 'Request failed',
					response: response
				}
			});
		}

		categories = await response.json();
	} catch (error) {
		console.log('category response::error::', error);
	}
	setHeaders({
		'cache-control': 'max-age=60'
	});

	return json({ categories: [...categories] });
}
