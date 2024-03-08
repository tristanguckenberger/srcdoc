// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
// import { playlistData } from '$lib/stores/playlistStore.js';

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();
	return user;
};

// const getAllPlaylistsByUser = async (eventFetch) => {
// 	const playlistRes = await eventFetch(`/api/playlist/myLibrary`);
// 	const playlists = await playlistRes.json();
// 	return playlists;
// };

const getAllGamesForPlaylist = async (eventFetch, playlistId) => {
	const playlistRes = await eventFetch(`/api/playlist/${playlistId}/games`);
	const games = await playlistRes.json();
	console.log('playlist::games::', games);
	return games;
};

export async function load({ cookies, params, fetch }) {
	const { slug } = params;
	console.log('slug::', slug);
	if (!slug) {
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

	const playlistGames = await getAllGamesForPlaylist(fetch, slug);

	console.log('playlistGames::', playlistGames);

	session.set({
		...user
	});

	// make sure to set a store to hold the games for the playlist
	// playlistData.set(userPlaylists ? [...userPlaylists].reverse() : []);

	return {
		games: playlistGames ? [...playlistGames.games] : [],
		sessionData: {
			...user
		}
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
	addGameToPlaylist: async () => {},
	removeGameFromPlaylist: async () => {},
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
