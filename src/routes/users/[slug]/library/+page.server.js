// @ts-nocheck
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
// import { playlistData } from '$lib/stores/playlistStore.js';

const getAllPlaylistsByUser = async (eventFetch) => {
	const playlistRes = await eventFetch(`/api/playlist/myLibrary`);
	const playlists = await playlistRes.json();
	return playlists;
};

export async function load({ cookies, params, fetch }) {
	const { slug } = params;
	if (!slug) {
		return redirect(303, '/games');
	}

	const token = cookies?.get('token');
	if (!token) {
		throw redirect(303, '/');
	}

	const userPlaylists = await getAllPlaylistsByUser(fetch);

	// session.set({
	// 	...user
	// });

	// playlistData.set(userPlaylists ? [...userPlaylists].reverse() : []);

	return {
		playlists: userPlaylists ? [...userPlaylists].reverse() : []
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
