// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, cookies }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});
	const token = cookies.get('token');
	const favsReqHeaders = new Headers();
	favsReqHeaders.append('Content-Type', 'application/json');
	favsReqHeaders.append('Authorization', `Bearer ${token}`);
	const favReqInit = {
		method: 'GET',
		headers: favsReqHeaders
	};

	// rewrite the endpoint path... the url is dumb and should be /api/games/${slug}/favorites`
	const favsResponse = await fetch(`${process.env.SERVER_URL}/api/favorites/user`, favReqInit);

	const favorites = await favsResponse.json();

	return json(favorites);
}
