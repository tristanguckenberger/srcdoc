import { json } from '@sveltejs/kit';

export async function GET({ setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});
	const gamesReqHeaders = new Headers();
	const gamesReqInit = {
		method: 'GET',
		headers: gamesReqHeaders
	};

	const gamesResponse = await fetch(`${process.env.SERVER_URL}/api/games/all`, gamesReqInit);

	if (!gamesResponse.ok) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const games = await gamesResponse.json();
	return json(games);
}
