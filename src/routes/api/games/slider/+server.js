// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
	const limit = parseInt(url.searchParams.get('limit'), 10) || 5;
	const currentGame = parseInt(url.searchParams.get('currentGame'), 10);
	const token = cookies.get('token');

	if (!currentGame) {
		return json({ message: 'Please provide a valid current game ID' }, { status: 400 });
	}

	const gpReqHeaders = new Headers();

	if (token) {
		gpReqHeaders.append('Authorization', `Bearer ${token}`);
	} else {
		gpReqHeaders.append('Authorization', 'bypassable');
	}

	const gpReqInit = {
		method: 'GET',
		headers: gpReqHeaders
	};

	try {
		const gpResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/slider?limit=${limit}&currentGame=${currentGame}`,
			gpReqInit
		);

		if (!gpResponse.ok) {
			throw new Error('Failed to fetch games');
		}

		const { games, total } = await gpResponse.json();

		// setHeaders({
		// 	'cache-control': 'max-age=60'
		// });
		return json({ games, total });
	} catch (error) {
		console.error('Error fetching paginated games:', error);
		return json({ message: 'Internal server error' }, { status: 500 });
	}
}
