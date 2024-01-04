// @ts-nocheck
import { session } from '$lib/stores/sessionStore';

const getCurrentUser = async (eventFetch) => {
	// const token = cookies.get('token');
	// if (token) {
	// 	const userReqHeaders = new Headers();
	// 	userReqHeaders?.append('Authorization', `Bearer ${token}`);
	// 	const userReqInit = {
	// 		method: 'GET',
	// 		headers: userReqHeaders
	// 	};

	// 	const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/me`, userReqInit);
	// 	if (!userResponse.ok) {
	// 		return {
	// 			status: 401,
	// 			body: {
	// 				message: 'Authentication failed'
	// 			}
	// 		};
	// 	}

	// 	const user = await userResponse.json();
	// 	return user;
	// }

	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();

	return user;
};

export async function load({ cookies, fetch }) {
	// setHeaders({
	// 	'cache-control': 'max-age=60'
	// });
	session.subscribe(async (session) => {
		try {
			session?.token &&
				cookies.set('token', session?.token, {
					secure: false
				});
		} catch (error) {
			console.log('error::', error);
		}
	});

	const user = await getCurrentUser(fetch);

	// if (user?.is_active) {
	// 	throw redirect(300, `/games`);
	// }

	session.set({
		...user,
		password: ''
	});

	return {
		sessionData: {
			...user,
			password: ''
		}
	};
}
