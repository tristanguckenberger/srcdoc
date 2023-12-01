// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';

export async function load({ cookies }) {
	session.subscribe(async (session) => {
		try {
			session?.token && cookies.set('token', session?.token);
		} catch (error) {
			console.log('error::', error);
		}
	});

	const getCurrentUser = async () => {
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

	const user = await getCurrentUser();

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

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const credentials = JSON.stringify({ email, password });
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: credentials
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/auth/login`, requestInit);
		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			};
		}

		const token = (await authResponse.json()).token;
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

			return {
				status: 200,
				body: {
					message: 'login_success',
					user: { token, ...user, password: '' }
				}
			};
		}
	}
};
