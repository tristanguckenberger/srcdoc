// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
// import { redirect } from '@sveltejs/kit';

const getTopRatedGames = async (eventFetch) => {
	const topRatedRes = await eventFetch(`/api/topRated`);
	const topRatedGames = await topRatedRes.json();

	return topRatedGames;
};

// const getCurrentUser = async (eventFetch) => {
// 	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
// 	const user = await userResponse.json();
// 	return user;
// };

export async function load({ fetch }) {
	const topRated = await getTopRatedGames(fetch);
	gamesData.set([...topRated]);

	return {
		games: [...topRated]
	};
}

export const actions = {
	// add a new playlist
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
	}
};
