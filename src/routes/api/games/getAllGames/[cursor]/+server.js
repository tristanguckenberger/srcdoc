//  @ts-nocheck
import { cursorStore } from '$lib/stores/pagination/paginationStore.js';
import { gamesData } from '$lib/stores/gamesStore.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	// const gamesReqHeaders = new Headers();
	const gamesReqInit = {
		method: 'GET'
	};

	const { cursor } = params;
	console.log('getAllGames::cursor::', cursor);

	/**
	 * @type {{{
	 * 	id: string;
	 * 	user_id: string;
	 * 	title: string;
	 * 	description: string;
	 * 	published: boolean;
	 * 	createdAt: string;
	 * 	updatedAt: string;
	 * 	thumbnail: string;
	 * }[]
	 * nextCursor: number;}}
	 */
	let existingGames;
	let newGames;
	let newGamesSet;
	let games;
	let next;
	const limit = 20;

	gamesData.subscribe((games) => {
		existingGames = games ?? [];
	});

	// console.log('next::', next);
	// console.log('existingGames::', existingGames);

	if (existingGames.length === 0) {
		next = 0;
	}

	if (existingGames.some((game) => game.id.toString() === next?.toString())) {
		// console.log('getAllGames::nextCursor::', next);
		// console.log('getAllGames::existingGames::', existingGames);
		// next = 0;
	}

	next = cursor;

	try {
		const gamesResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/all?cursor=${next}&limit=${limit}`,
			gamesReqInit
		);

		if (!gamesResponse.ok) {
			return json({
				status: 401,
				body: {
					message: 'Request failed',
					response: gamesResponse
				}
			});
		}

		newGames = await gamesResponse.json();
		newGamesSet = new Set(newGames?.games.map((game) => game));
		next = newGames.nextCursor;
		const existingGamesSet = new Set(existingGames.map((game) => game));

		games = { games: [...newGamesSet, ...existingGamesSet], nextCursor: newGames.nextCursor };
	} catch (error) {
		console.log('gamesResponse::error::', error);
	}
	// setHeaders({
	// 	'cache-control': 'max-age=60'
	// });

	// before returning the games we need to remove any duplicates
	const gamesSet = new Set(games?.games.map((game) => game));

	// create a new array of games from the set of games
	games = { games: [...gamesSet], nextCursor: newGames.nextCursor };
	cursorStore.set({ current: newGamesSet?.[newGamesSet?.length - 1]?.id, next: next });

	return json(games);
}
