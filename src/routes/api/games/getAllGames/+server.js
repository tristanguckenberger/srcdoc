//  @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders }) {
	// const gamesReqHeaders = new Headers();
	const gamesReqInit = {
		method: 'GET'
	};

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
	let games;

	try {
		const gamesResponse = await fetch(`${process.env.SERVER_URL}/api/games/all`, gamesReqInit);

		if (!gamesResponse.ok) {
			return json({
				status: 401,
				body: {
					message: 'Request failed',
					response: gamesResponse
				}
			});
		}

		games = await gamesResponse.json();
	} catch (error) {
		console.log('gamesResponse::error::', error);
	}
	setHeaders({
		'cache-control': 'max-age=60'
	});

	// before returning the games we need to remove any duplicates
	const gamesSet = new Set(games?.games.map((game) => game));

	return json({ games: [...gamesSet] });
}
