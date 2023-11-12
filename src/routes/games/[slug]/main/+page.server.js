import { gameData } from '$lib/mockData/gameData.js';
import { commentData } from '$lib/mockData/commentData.js';

export function load({ params }) {
	const { slug } = params;

	// find the game by slug
	const game = gameData.find((game) => game?.id.toString() === slug.toString());
	const comments = commentData.filter((comment) => comment?.gameId.toString() === slug.toString());

	return {
		...game,
		comments: [...comments]
	};
}
