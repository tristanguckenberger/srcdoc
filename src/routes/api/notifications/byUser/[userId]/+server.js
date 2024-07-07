import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params, cookies }) {
	const { userId } = params;
	const token = cookies.get('token') ?? localStorage?.getItem('token');

	const userReqHeaders = new Headers();
	userReqHeaders.append('Content-Type', 'application/json');
	userReqHeaders.append('Authorization', `Bearer ${token}`);
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(
		`${process.env.SERVER_URL}/api/notifications/users/${userId}`,
		userReqInit
	);

	if (!userResponse.ok) {
		return json([]);
	}

	const games = await userResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json(games);
}
