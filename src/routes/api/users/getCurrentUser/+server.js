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
		if (userResponse.status === 400 || userResponse.status === 401 || userResponse.status === 404) {
			cookies.delete('token', { path: '/' });
			cookies.delete('isActive', { path: '/' });
			cookies.delete('profile_photo', { path: '/' });
			cookies.delete('userId', { path: '/' });
			cookies.delete('username', { path: '/' });

			return json({
				status: userResponse.status,
				body: {
					message: `Authentication expired. Please log in again.`
				}
			});
		}
	}

	let user = await userResponse.json();

	delete user?.password;
	user = { ...user };
	delete user?.token;
	user = { ...user };

	return json(user);
}
