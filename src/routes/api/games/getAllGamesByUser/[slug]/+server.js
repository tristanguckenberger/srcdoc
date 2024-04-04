import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { slug } = params;
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(`${process.env.SERVER_URL}/api/games/user/${slug}`, userReqInit);

	if (!userResponse.ok) {
		return json([]);
	}

	const games = await userResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json(games);
}
