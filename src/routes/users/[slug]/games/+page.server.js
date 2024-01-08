// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
import { gamesData } from '$lib/stores/gamesStore.js';

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();

	return user;
};

const getAllGamesByUser = async (userId, eventFetch) => {
	const gamesRes = await eventFetch(`/api/games/getAllGamesByUser/${userId}`);
	const games = await gamesRes.json();
	return games;
};

export async function load({ cookies, params, fetch }) {
	if (!params?.slug) {
		return redirect(303, '/games');
	}

	const token = cookies?.get('token');
	if (!token) {
		throw redirect(303, '/');
	}

	const user = await getCurrentUser(fetch);
	if (!user || user?.status === 401) {
		throw redirect(303, '/games');
	}
	const userGames = await getAllGamesByUser(params?.slug, fetch);

	session.set({
		...user
	});

	gamesData.set([...userGames].reverse());

	return {
		games: [...userGames].reverse(),
		sessionData: {
			...user
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

		if (project?.id) {
			throw redirect(300, `/games/${project?.id}/play`);
		}
		return {
			status: 300,
			redirect: `/games/${project?.id}/play`,
			body: {
				message: 'add_project_success',
				project: project
			}
		};
	}
};
