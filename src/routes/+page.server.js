// @ts-nocheck
// import { session } from '$lib/stores/sessionStore.js';
import { userStore } from '$lib/stores/authStore.js';
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

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
		console.log('usersResponse::error::', error);
	}

	return users;
};

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
	const token = cookies?.get('token');

	const users = await getAllUsers();
	users?.length && userStore.set(users);

	if (!token) {
		return {
			users: users
		};
	}

	const user = await getCurrentUser(fetch);

	if (user?.is_active) {
		throw redirect(307, `/games`);
	} else {
		throw redirect(303, `/users/${user?.id}/verify`);
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
		// console.log(
		// 	'authResponse::cookies::::::::::::::::::::::::::::::::::::::',
		// 	authResponse.cookies
		// );
		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			};
		}

		const resAuth = await authResponse.json();

		// console.log('authResponse::::::::::::::::::::::::::::::::::::::::', resAuth);/

		const token = resAuth?.token;

		if (token) {
			try {
				cookies.set('token', token, {
					path: '/'
				});
			} catch (error) {
				console.log('cookieError::', error);
			}

			// const cookie_token = cookies?.get('token');

			// console.log('cookie_token:::::::::::::', cookie_token);

			const user = await getCurrentUser(fetch);

			if (user) {
				session.set({
					...user
				});

				if (user?.is_active) {
					throw redirect(303, `/games`);
				}
			}

			return {
				status: 200,
				body: {
					message: 'login_success',
					user: { token, ...user, password: '' }
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
			return {
				status: 401,
				body: {
					message: 'Registration failed'
				}
			};
		}

		const token = (await authResponse.json()).token;
		if (token) {
			try {
				cookies.set('token', token, {
					path: '/'
				});
			} catch (error) {
				console.log('cookieError::', error);
			}

			const user = await getCurrentUser(fetch);

			if (user) {
				session.set({
					...user
				});
			}

			return {
				status: 200,
				redirect: '/games',
				body: {
					message: 'registration_success',
					user: { token, ...user, password: '' }
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
	logout: async ({ cookies }) => {
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
		cookies.delete('token');
		// throw redirect(300, '/');

		return {
			status: 307,
			redirect: '/',
			body: {
				message: 'logout_success'
			}
		};
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
	}
};
