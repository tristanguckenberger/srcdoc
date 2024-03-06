// @ts-nocheck
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';
import { playlistData } from '$lib/stores/playlistStore.js';

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();

	return user;
};

const getAllPlaylistsByUser = async (userId, eventFetch) => {
	const playlistRes = await eventFetch(`/api/playlist/AllByUser/${userId}`);
	const playlists = await playlistRes.json();
	return playlists;
};

export async function load({ cookies, params, fetch }) {
	const { slug } = params;
	if (!slug) {
		return redirect(303, '/games');
	}

	console.log('slug::', slug);

	const token = cookies?.get('token');
	if (!token) {
		throw redirect(303, '/');
	}

	const user = await getCurrentUser(fetch);
	if (!user || user?.status === 401) {
		throw redirect(303, '/games');
	}
	const userPlaylists = await getAllPlaylistsByUser(slug, fetch);

	console.log('userPlaylists::', userPlaylists);

	session.set({
		...user
	});

	playlistData.set(userPlaylists ? [...userPlaylists].reverse() : []);

	return {
		playlists: userPlaylists ? [...userPlaylists].reverse() : [],
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
	removeGameFromPlaylist: async () => {}
};
