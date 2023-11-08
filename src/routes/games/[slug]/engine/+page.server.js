import { gameData } from '$lib/mockData/gameData.js';

export function load({ params }) {
	const { slug } = params;

	// find the game by slug
	const game = gameData.find((game) => game?.id.toString() === slug.toString());

	return {
		...game
	};
}
