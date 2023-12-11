// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { commentData } from '$lib/mockData/commentData.js';
import { modalOpenState } from '$lib/stores/layoutStore.js';

const getSingleGame = async (slug) => {
	const gameReqHeaders = new Headers();
	const gameReqInit = {
		method: 'GET',
		headers: gameReqHeaders
	};

	const gameResponse = await fetch(`${process.env.SERVER_URL}/api/games/${slug}`, gameReqInit);
	if (!gameResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		};
	}

	const game = await gameResponse.json();
	return game;
};

export async function load({ params }) {
	modalOpenState.set(false);
	const { slug } = params;

	const game =
		(await getSingleGame(slug)) ?? gameData.find((game) => game?.id.toString() === slug.toString());

	// find the game by slug
	const comments = commentData.filter((comment) => comment?.gameId.toString() === slug.toString());

	return {
		...game,
		comments: [...comments]
	};
}
