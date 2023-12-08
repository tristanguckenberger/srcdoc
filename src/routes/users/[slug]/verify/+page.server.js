// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
// import { redirect } from '@sveltejs/kit';

const getCurrentUser = async (cookies) => {
	const token = cookies.get('token');
	if (token) {
		const userReqHeaders = new Headers();
		userReqHeaders?.append('Authorization', `Bearer ${token}`);
		const userReqInit = {
			method: 'GET',
			headers: userReqHeaders
		};

		const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/me`, userReqInit);
		if (!userResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			};
		}

		const user = await userResponse.json();
		return user;
	}
};

export async function load({ cookies }) {
	console.log('HIT LOAD FUNCTION::');
	if (!cookies.get('token')) {
		session.subscribe(async (session) => {
			try {
				session?.token && cookies.set('token', session?.token);
			} catch (error) {
				console.log('error::', error);
			}
		});
	}

	const user = await getCurrentUser(cookies);
	console.log('user::', user);

	// if (user?.is_active) {
	// 	try {
	// 		throw redirect(300, `/games`);
	// 	} catch (error) {
	// 		console.log('error::', error);
	// 	}
	// }

	return {
		sessionData: {
			...user,
			password: ''
		}
	};
}

export const actions = {
	verify: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const verificationCode = data.get('verificationCode');

		console.log('verificationCode::', verificationCode);

		const credentials = JSON.stringify({ verificationToken: verificationCode });
		const requestHeaders = new Headers();
		if (!requestHeaders.has('Authorization')) {
			requestHeaders.append('Authorization', `Bearer ${token}`);
		}
		requestHeaders.append('Content-Type', 'application/json');

		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: credentials
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/auth/verify`, requestInit);
		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Verification failed'
				}
			};
		}

		const user = await getCurrentUser(cookies);

		return {
			status: 200,
			body: {
				message: 'verification_success',
				user: { token, ...user, password: '' }
			}
		};
	}
};
