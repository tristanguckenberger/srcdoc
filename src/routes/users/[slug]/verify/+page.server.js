// @ts-nocheck
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

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
	if (!cookies.get('token')) {
		redirect('/');
		return {
			status: 300,
			redirect: '/',
			headers: {
				'Cache-Control': 'no-store, max-age=0'
			},
			body: {}
		};
	}
	const user = await getCurrentUser(cookies);

	return {
		sessionData: {
			...user
		}
	};
}

export const actions = {
	verify: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const verificationCode = data.get('verificationCode');
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
