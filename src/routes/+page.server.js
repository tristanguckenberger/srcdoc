// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
import { userStore } from '$lib/stores/authStore.js';

const getAllUsers = async () => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const usersResponse = await fetch(`${process.env.SERVER_URL}/api/users/all`, userReqInit);
	if (!usersResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		};
	}

	const users = await usersResponse.json();
	return users;
};

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
	session.subscribe(async (session) => {
		try {
			session?.token && cookies.set('token', session?.token);
		} catch (error) {
			console.log('error::', error);
		}
	});

	const user = await getCurrentUser(cookies);

	const users = await getAllUsers();

	users?.length && userStore.set(users);

	// console.log('users::', users);

	userStore.subscribe((users) => {
		console.log('user::', users);
	});

	session.set({
		...user,
		password: ''
	});

	return {
		users: users,
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
	},
	register: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const username = data.get('username');
		const password = data.get('password');

		const credentials = JSON.stringify({ email, username, password });
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
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
					message: 'registration_success',
					user: { token, ...user, password: '' }
				}
			};
		}
	}
};
