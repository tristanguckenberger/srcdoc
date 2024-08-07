// @ts-nocheck
import { redirect } from '@sveltejs/kit';

const getCurrentUser = async (eventFetch) => {
	let user;
	try {
		const userResponse = await eventFetch(`/api/users/getCurrentUser`);
		user = await userResponse.json();
	} catch (error) {
		console.error('getCurrentUser::error::', error);
	}

	return user;
};

export async function load({ cookies, fetch }) {
	if (!cookies.get('token')) {
		throw redirect(307, '/');
	}
	const user = await getCurrentUser(fetch);

	if (user?.is_active) {
		throw redirect(307, `/games`);
	}

	return {
		sessionData: {
			...user
		}
	};
}

export const actions = {
	// add a new playlist
	createPlaylist: async () => {
		// Return a response
		return {
			status: 200,
			body: {
				message: 'Cannot create Playlists until you verify your account'
			}
		};
	},
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

		cookies.set('isActive', true, {
			path: '/'
		});

		return {
			status: 200,
			body: {
				message: 'verification_success'
			}
		};
	},
	search: async ({ fetch, request }) => {
		const formData = await request.formData();
		const query = formData?.get('query');
		const searchResults = await fetch(`${process.env.SERVER_URL}/api/search/basic?q=${query}`);

		if (!searchResults.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to search'
				}
			};
		}

		const result = await searchResults.json();

		return {
			result
		};
	}
};
