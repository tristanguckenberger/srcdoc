import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
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
		cookies.delete('token', { path: '/' });
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	let user = await userResponse.json();

	delete user?.password;
	user = { ...user };
	delete user?.token;
	user = { ...user };

	return json(user);
}
