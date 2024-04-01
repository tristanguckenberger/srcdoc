// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
// import { playlistData } from '$lib/stores/playlistStore.js';

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();
	return user;
};

const getAllGamesForPlaylist = async (eventFetch, playlistId) => {
	const playlistRes = await eventFetch(`/api/playlist/${playlistId}/games`);
	const games = await playlistRes.json();
	return games;
};

const getSinglePlaylist = async (eventFetch, playlistId) => {
	const playlistRes = await eventFetch(`/api/playlist/${playlistId}`);
	const playlist = await playlistRes.json();
	return playlist;
};

export async function load({ params, fetch }) {
	const { slug } = params;
	if (!slug) {
		return redirect(303, '/games');
	}

	// const token = cookies?.get('token');
	// if (!token) {
	// 	throw redirect(303, '/');
	// }

	const user = await getCurrentUser(fetch);
	// if (!user || user?.status === 401) {
	// 	throw redirect(303, '/games');
	// }

	const playlist = await getSinglePlaylist(fetch, slug);

	const playlistMap = Object.keys(playlist).reduce((acc, key) => {
		let newKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase());
		acc[newKey] = playlist[key];
		return acc;
	}, {});

	if (!playlist) {
		throw redirect(303, '/games');
	}

	if (!playlist.is_public && playlist.owner_id.toString() !== user.id.toString()) {
		throw redirect(303, '/games');
	}

	const playlistGames = await getAllGamesForPlaylist(fetch, slug);

	if (user) {
		session.set({
			...user
		});
	}

	return {
		playlist: { ...playlistMap },
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
	// Leaving this note for now: This is basically the same as the updatePlaylist function in the other playlists server file,
	// for some reason the id is not making it to the server function (updatePlaylist) in one of these files
	// updatePlaylist: async ({ cookies, request, fetch }) => {
	// 	const token = cookies.get('token');
	// 	const formData = await request.formData();
	// 	console.log('playlists/[slug]/+page.server.js::updatePlaylist::formData::', formData);
	// 	const id = formData?.get('id');
	// 	const is_public = formData?.get('is_public');
	// 	const name = formData?.get('name');
	// 	const description = formData?.get('description');
	// 	const requestHeaders = new Headers();

	// 	const body = await request?.json();
	// 	console.log('json::body::', body);

	// 	requestHeaders.append('Content-Type', 'application/json');
	// 	requestHeaders.append('Authorization', `Bearer ${token}`);

	// 	const requestInit = {
	// 		method: 'PUT',
	// 		headers: requestHeaders,
	// 		mode: 'cors',
	// 		body: JSON.stringify({
	// 			is_public,
	// 			name,
	// 			description
	// 		})
	// 	};

	// 	const response = await fetch(`${process.env.SERVER_URL}/api/playlist/${id}`, requestInit);
	// 	const result = await response.json();
	// 	return {
	// 		status: 200,
	// 		body: {
	// 			result
	// 		}
	// 	};
	// },
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
