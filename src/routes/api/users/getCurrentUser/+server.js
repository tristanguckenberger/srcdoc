import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, cookies }) {
	const token = cookies.get('token');
	if (!token) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}
	const userReqHeaders = new Headers();
	userReqHeaders?.append('Authorization', `Bearer ${token}`);
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/me`, userReqInit);
	if (!userResponse.ok) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const user = await userResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});

	return json(user);
}
