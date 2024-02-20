// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
// import { redirect } from '@sveltejs/kit';

const getTopTrendingGames = async (eventFetch) => {
	const topTrendingRes = await eventFetch(`/api/trending/top`);
	const trendingGames = await topTrendingRes.json();

	return trendingGames;
};

// const getCurrentUser = async (eventFetch) => {
// 	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
// 	const user = await userResponse.json();
// 	return user;
// };

export async function load({ fetch }) {
	const trending = await getTopTrendingGames(fetch);

	gamesData.set([...trending]);

	return {
		games: [...trending]
	};
}
