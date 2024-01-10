// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';

const getAllGames = async (eventFetch) => {
	const allGamesRes = await eventFetch(`/api/games/getAllGames`);
	return await allGamesRes.json();
};

export async function load({ fetch }) {
	const allGames = await getAllGames(fetch);

	const publishedGames = allGames?.filter((game) => game.published);
	gamesData.set([...publishedGames].reverse());

	return {
		quickPlayGames: [...publishedGames].reverse()
	};
}
