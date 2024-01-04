import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { slug } = params;
	const userReqHeaders = new Headers();
	const gameReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const gameResponse = await fetch(`${process.env.SERVER_URL}/api/games/${slug}`, gameReqInit);
	if (!gameResponse.ok) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const games = await gameResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});

	return json(games);
}
