import { json } from '@sveltejs/kit';

// const getCurrentUser = async (eventFetch) => {
// 	let user;
// 	try {
// 		const userResponse = await eventFetch(`/api/users/getCurrentUser`);
// 		user = await userResponse.json();
// 	} catch (error) {
// 		console.log('getCurrentUser::error::', error);
// 	}

// 	return user;
// };

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

	setHeaders({
		'cache-control': 'max-age=604800'
	});
	return json(user);
}
