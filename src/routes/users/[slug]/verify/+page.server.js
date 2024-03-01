// @ts-nocheck
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

const getCurrentUser = async (eventFetch) => {
	let user;
	try {
		const userResponse = await eventFetch(`/api/users/getCurrentUser`);
		user = await userResponse.json();
	} catch (error) {
		console.log('getCurrentUser::error::', error);
	}

	return user;
};

export async function load({ cookies, fetch }) {
	if (!cookies.get('token')) {
		throw redirect('/');
	}
	const user = await getCurrentUser(fetch);

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
