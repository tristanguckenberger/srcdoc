import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, url, cookies }) {
	const limit = url.searchParams.get('limit') ?? 50;
	const offset = url.searchParams.get('offset') ?? 0;
	const token = cookies.get('token');
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

	const gpResponse = await fetch(
		`${process.env.SERVER_URL}/api/games/paginated?limit=${limit}&offset=${offset}`,
		gpReqInit
	);

	if (!gpResponse.ok) {
		return json({ games: [], total: 0 });
	}

	const { games, total } = await gpResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json({ games, total });
}
