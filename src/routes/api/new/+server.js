import { json } from '@sveltejs/kit';

export async function GET({ setHeaders }) {
	const gamesReqHeaders = new Headers();
	const gamesReqInit = {
		method: 'GET',
		headers: gamesReqHeaders
	};

	let games;
	try {
		const gamesResponse = await fetch(`${process.env.SERVER_URL}/api/algo/new`, gamesReqInit);
		if (!gamesResponse.ok) {
			return json({
				status: 401,
				body: {
					message: 'Request failed',
					response: gamesResponse
				}
			});
		}
		games = await gamesResponse.json();
	} catch (error) {
		console.log('gamesResponse::error::', error);
	}

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json(games);
}
