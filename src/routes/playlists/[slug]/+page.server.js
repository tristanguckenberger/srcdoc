// @ts-nocheck
import { redirect } from '@sveltejs/kit';

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

	const user = await getCurrentUser(fetch);
	const playlist = await getSinglePlaylist(fetch, slug);

	const playlistMap = Object.keys(playlist).reduce((acc, key) => {
		let newKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase());
		acc[newKey] = playlist[key];
		return acc;
	}, {});

	if (!playlist) {
		throw redirect(303, '/games');
	}

	if (
		!playlist.is_public &&
		(playlist?.owner_id?.toString() !== user?.id?.toString() ||
			playlist?.ownerId?.toString() !== user?.id?.toString())
	) {
		throw redirect(303, '/games');
	}

	const playlistGames = await getAllGamesForPlaylist(fetch, slug);

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
	updatePlaylist: async ({ cookies, request, fetch, params }) => {
		const token = cookies.get('token');
		const { slug } = params;
		const formData = await request.formData();
		const requestHeaders = new Headers();

		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'PUT',
			mode: 'cors',
			headers: requestHeaders,
			body: formData
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/playlist/${slug}`, requestInit);
		const result = await response.json();
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
