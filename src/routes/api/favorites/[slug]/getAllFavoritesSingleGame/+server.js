// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { slug } = params;

	const favsReqHeaders = new Headers();
	const favReqInit = {
		method: 'GET',
		headers: favsReqHeaders
	};

	// rewrite the endpoint path... the url is dumb and should be /api/games/${slug}/favorites`
	let favorites;
	try {
		const favsResponse = await fetch(
			`${process.env.SERVER_URL}/api/favorites/games/${slug}`,
			favReqInit
		);

		if (!favsResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Request failed',
					data: []
				}
			};
		}

		favorites = await favsResponse.json();
	} catch (error) {
		console.log('src/routes/api/favorites/[slug]/getAllFavoritesSingleGame::error::', error);
	}

	setHeaders({
		'cache-control': 'max-age=60'
	});

	return json(favorites);
}
