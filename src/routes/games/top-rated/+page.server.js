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
