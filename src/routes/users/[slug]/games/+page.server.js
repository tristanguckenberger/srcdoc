// @ts-nocheck
// import { gameData } from '$lib/mockData/gameData.js';
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
import { gamesData } from '$lib/stores/gamesStore.js';

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

const getAllGamesByUser = async (userId) => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(
		`${process.env.SERVER_URL}/api/games/user/${userId}`,
		userReqInit
	);
	if (!userResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		};
	}

	const games = await userResponse.json();
	return games;
};

export async function load({ cookies, params }) {
	session.subscribe(async (session) => {
		try {
			const token = cookies?.get('token');
			if (session?.token && !token) {
				cookies?.set('token', session?.token);
			}
		} catch (error) {
			console.log('error::', error);
		}
	});

	const user = await getCurrentUser(cookies);

	if (!user) {
		return redirect(300, '/games');
	}
	const userGames = await getAllGamesByUser(params?.slug);

	console.log('user::::', user);

	// if (user && (!user?.is_active ?? !user?.isActive)) {
	// 	throw redirect(300, `/users/${user?.id}/verify`);
	// }

	session.set({
		...user,
		password: ''
	});

	gamesData.set([...userGames].reverse());

	return {
		games: [...userGames].reverse(),
		sessionData: {
			...user,
			password: ''
		}
	};
}

export const actions = {
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
		console.log('project::', project);

		if (project?.id) {
			throw redirect(300, `/games/${project?.id}/main`);
		}
		return {
			status: 300,
			redirect: `/games/${project?.id}/main`,
			body: {
				message: 'add_project_success',
				project: project
			}
		};
	}
};
