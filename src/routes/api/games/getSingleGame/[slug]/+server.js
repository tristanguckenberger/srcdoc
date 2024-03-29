import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { slug } = params;
	const userReqHeaders = new Headers();
	const gameReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};
	let games = [];
	try {
		const gameResponse = await fetch(`${process.env.SERVER_URL}/api/games/${slug}`, gameReqInit);
		if (!gameResponse.ok) {
			return json({
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			});
		}

		games = await gameResponse.json();
	} catch (error) {
		console.log('gameResponse::error::', error);
	}

	setHeaders({
		'cache-control': 'max-age=604800'
	});
	return json(games);
}
