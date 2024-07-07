import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params, cookies, url }) {
	const { userId } = params;
	const token = cookies.get('token') ?? localStorage?.getItem('token');

	const limit = url.searchParams.get('limit') ?? 50;
	const offset = url.searchParams.get('offset') ?? 0;

	const userReqHeaders = new Headers();
	userReqHeaders.append('Content-Type', 'application/json');
	userReqHeaders.append('Authorization', `Bearer ${token}`);
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(
		`${process.env.SERVER_URL}/api/notifications/users/${userId}?limit=${limit}&offset=${offset}`,
		userReqInit
	);

	if (!userResponse.ok) {
		return json({ notifications: [], total: 0 });
	}

	const { notifications, total } = await userResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json({ notifications, total });
}
