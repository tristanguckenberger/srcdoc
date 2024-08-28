// @ts-nocheck
// import { session } from '$lib/stores/sessionStore.js';
// import { userStore } from '$lib/stores/authStore.js';
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
import { getCurrentUser } from './api/utils/getFuncs.js';
// import { connectWebSocket } from '$lib/stores/websocketStore.js';
// import { json } from '@sveltejs/kit';

const getAllUsers = async () => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};
	let users = [];
	try {
		const usersResponse = await fetch(`${process.env.SERVER_URL}/api/users/all`, userReqInit);
		if (!usersResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to get all users',
					response: usersResponse
				}
			};
		}
		users = await usersResponse.json();
	} catch (error) {
		console.error('usersResponse::error::', error);
	}

	return users;
};

export async function load({ cookies /**fetch*/ }) {
	const token = cookies?.get('token');
	const isActive = cookies?.get('isActive');
	const userId = cookies?.get('userId');

	// users?.length && userStore.set(users);

	if (!token) {
		const users = await getAllUsers();
		return {
			users: users
		};
	}

	if (isActive) {
		throw redirect(307, `/games`);
	} else {
		throw redirect(303, `/users/${userId}/verify`);
	}
}

export const actions = {
	login: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const credentials = JSON.stringify({ email, password });
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Access-Control-Allow-Origin', '*');
		requestHeaders.append('credentials', 'include');
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: credentials
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/auth/login`, requestInit);
		if (!authResponse.ok) {
			const res = await authResponse.json();

			return {
				status: 401,
				body: res
			};
		}

		const resAuth = await authResponse.json();
		const token = resAuth?.token;
		const user = resAuth?.user;
		const settings = resAuth?.settings;

		if (token) {
			try {
				cookies.set('token', token, {
					path: '/'
				});
				cookies.set('userId', JSON.stringify(user?.id), {
					path: '/'
				});
				cookies.set('username', JSON.stringify(user?.username), {
					path: '/'
				});
				cookies.set('isActive', JSON.stringify(user?.is_active), {
					path: '/'
				});
				cookies.set('profile_photo', user?.profile_photo, {
					path: '/'
				});
			} catch (error) {
				console.error('cookieError::', error);
			}

			return {
				status: 200,
				body: {
					message: 'login_success',
					user: { ...user, password: '', verification_token: '', reset_password_token: '' },
					settings
				}
			};
		}
	},
	register: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const username = data.get('username');
		const password = data.get('password');

		const credentials = JSON.stringify({ email, username, password });
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Access-Control-Allow-Origin', '*');
		requestHeaders.append('Credentials', 'Include');
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: credentials
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/auth/register`, requestInit);
		if (!authResponse.ok) {
			const { message } = await authResponse.json();

			return {
				status: 401,
				body: {
					message
				}
			};
		}

		const resAuth = await authResponse.json();
		const token = resAuth?.token;
		const user = resAuth?.user;
		const settings = resAuth?.settings;

		if (token) {
			try {
				cookies.set('token', token, {
					path: '/'
				});
				cookies.set('userId', JSON.stringify(user?.id), {
					path: '/'
				});
				cookies.set('username', JSON.stringify(user?.username), {
					path: '/'
				});
				cookies.set('isActive', JSON.stringify(user?.is_active), {
					path: '/'
				});
			} catch (error) {
				console.error('cookieError::', error);
			}

			return {
				status: 200,
				redirect: '/games',
				body: {
					message: 'registration_success',
					user: { ...user, password: '' },
					settings
				}
			};
		}

		// Add the following line to ensure the return statement is hit
		return {
			status: 200,
			body: {
				message: 'registration_success'
			}
		};
	},
	logout: async ({ cookies, setHeaders }) => {
		const token = cookies.get('token');
		const requestHeaders = new Headers();
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors'
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/auth/logout`, requestInit);

		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Logout failed'
				}
			};
		}
		cookies.delete('token', { path: '/' });

		// const logoutResponse = await authResponse.json();

		setHeaders({
			'cache-control': 'no-store'
		});

		redirect(307, '/games');

		return {
			status: 200,
			body: {
				message: 'logout_success'
			}
		};
		// return json(logoutResponse);
	},
	session: async ({ cookies }) => {
		const user = await getCurrentUser(cookies);
		return {
			body: {
				user: user
			}
		};
	},
	addProject: async ({ cookies }) => {
		const token = cookies.get('token');
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors'
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/games/create`, requestInit);
		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to create new project'
				}
			};
		}

		const project = await authResponse.json();

		if (project?.id) {
			throw redirect(302, `/games/${project?.id}/play`);
		}
		return {
			status: 302,
			redirect: `/games/${project?.id}/play`,
			body: {
				message: 'add_project_success',
				project: project
			}
		};
	},
	updateSettings: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const hide_pop_up_info_home = formData?.get('hidePopUpInfoHome');
		const hide_pop_up_info_games = formData?.get('hidePopUpInfoGames');
		const hide_pop_up_info_editor = formData?.get('hidePopUpInfoEditor');
		const user_accent_color = formData?.get('userAccentColor');
		// const dark_mode = formData?.get('darkMode');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				hide_pop_up_info: false,
				hide_pop_up_info_home: hide_pop_up_info_home,
				hide_pop_up_info_games: hide_pop_up_info_games,
				hide_pop_up_info_editor: hide_pop_up_info_editor,
				user_accent_color,
				dark_mode: true
			})
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/settings/update`, requestInit);

		const result = await response.json();

		return {
			status: 200,
			body: {
				result
			}
		};
	},
	forgotPasswordRequest: async ({ request }) => {
		const formData = await request.formData();
		const email = formData?.get('email');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');

		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				email
			})
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/auth/forgot-password`, requestInit);
		const body = await response.json();

		return {
			status: 200,
			body
		};
	},
	resetPassword: async ({ request }) => {
		const formData = await request.formData();
		const password = formData?.get('password');
		const token = formData?.get('token');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');

		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				password
			})
		};

		const response = await fetch(
			`${process.env.SERVER_URL}/api/auth/reset-password/${token}`,
			requestInit
		);

		const { message } = await response.json();

		return {
			status: 200,
			body: {
				message
			}
		};
	},
	createPlaylist: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const isPublic = formData?.get('isPublic');
		const name = formData?.get('name');
		const description = formData?.get('description');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				isPublic,
				name,
				description
			})
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/playlist/create`, requestInit);

		const result = await response.json();

		// if (result?.id) {
		// 	throw redirect(302, `/playlists/${result?.id}`);
		// }

		// Return a response
		return {
			status: 200,
			body: {
				result
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
	},
	followUser: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const userId = formData?.get('userId');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'POST',
			headers: requestHeaders
		};

		const response = await fetch(
			`${process.env.SERVER_URL}/api/follows/follow/${userId}`,
			requestInit
		);

		const result = await response.json();

		return {
			status: 200,
			body: {
				result
			}
		};
	},
	unfollowUser: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const userId = formData?.get('userId');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'DELETE',
			headers: requestHeaders
		};

		const response = await fetch(
			`${process.env.SERVER_URL}/api/follows/unfollow/${userId}`,
			requestInit
		);

		const result = await response.json();

		return {
			status: 200,
			body: {
				result
			}
		};
	},
	resendVerificationEmail: async ({ request, fetch }) => {
		const formData = await request.formData();
		const userId = formData?.get('userId');
		const requestHeaders = new Headers();
		const requestInit = {
			method: 'GET',
			headers: requestHeaders
		};

		const response = await fetch(
			`${process.env.SERVER_URL}/api/auth/resend-verification-email/${userId}`,
			requestInit
		);
		const result = await response.json();

		return {
			status: 200,
			body: {
				result
			}
		};
	}
};
