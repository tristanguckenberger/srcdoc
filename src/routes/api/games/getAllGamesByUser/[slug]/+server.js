import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});
	const { slug } = params;
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(`${process.env.SERVER_URL}/api/games/user/${slug}`, userReqInit);

	if (!userResponse.ok) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const games = await userResponse.json();
	return json(games);
}
