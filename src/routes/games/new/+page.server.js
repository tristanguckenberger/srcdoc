// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
// import { redirect } from '@sveltejs/kit';

const getNewGames = async (eventFetch) => {
	const newGamesRes = await eventFetch(`/api/new`);
	const newGames = await newGamesRes.json();

	return newGames;
};

// const getCurrentUser = async (eventFetch) => {
// 	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
// 	const user = await userResponse.json();
// 	return user;
// };

export async function load({ fetch }) {
	const newGames = await getNewGames(fetch);

	gamesData.set([...newGames]);

	return {
		games: [...newGames]
	};
}
