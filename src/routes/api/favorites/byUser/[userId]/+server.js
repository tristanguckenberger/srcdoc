// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { userId } = params;
	const favsReqHeaders = new Headers();
	const favReqInit = {
		method: 'GET',
		headers: favsReqHeaders
	};

	// rewrite the endpoint path... the url is dumb and should be /api/games/${slug}/favorites`
	const favsResponse = await fetch(
		`${process.env.SERVER_URL}/api/favorites/single/user/${userId}`,
		favReqInit
	);

	const favorites = await favsResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json(favorites);
}
