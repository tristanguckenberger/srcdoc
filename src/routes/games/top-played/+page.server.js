// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
// import { redirect } from '@sveltejs/kit';

const getTopPlayedGames = async (eventFetch) => {
	const topTrendingRes = await eventFetch(`/api/topPlayed`);
	const trendingGames = await topTrendingRes.json();

	return trendingGames;
};

// const getCurrentUser = async (eventFetch) => {
// 	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
// 	const user = await userResponse.json();
// 	return user;
// };

export async function load({ fetch }) {
	const topPlayed = await getTopPlayedGames(fetch);

	gamesData.set([...topPlayed]);

	return {
		games: [...topPlayed]
	};
}
