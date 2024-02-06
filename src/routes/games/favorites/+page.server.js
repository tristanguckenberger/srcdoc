// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
import { redirect } from '@sveltejs/kit';

const getAllFavoritesByUser = async (eventFetch) => {
	const favoritesRes = await eventFetch(`/api/favorites/getAllFavoritesByUser`);
	const favorites = await favoritesRes.json();

	return favorites;
};

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();
	return user;
};

export async function load({ cookies, fetch }) {
	const token = cookies?.get('token');
	let user;

	if (!token) {
		throw redirect(307, `/games`);
	}

	let sessionData;

	if (token && !sessionData) {
		user = await getCurrentUser(fetch);

		if (!user || !user?.is_active) {
			throw redirect(307, `/games`);
		}

		sessionData = {
			...user
		};

		delete sessionData?.token && delete sessionData?.password;
	}

	const favorites = await getAllFavoritesByUser(fetch);

	gamesData.set([...favorites].reverse());

	return {
		games: [...favorites].reverse()
	};
}
