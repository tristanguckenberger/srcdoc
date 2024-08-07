// @ts-nocheck

async function getAllCommentsForAGame(fetch, slug) {
	const commentsRaw = await fetchData(fetch, `${process.env.SERVER_URL}/api/comments/game/${slug}`);
	if (!commentsRaw) return [];

	return commentsRaw;
}

async function fetchData(eventFetch, endpoint) {
	try {
		const response = await eventFetch(endpoint);
		if (!response.ok) throw new Error('Failed to fetch data');
		return await response.json();
	} catch (error) {
		console.error(error);
		return null; // Return null to handle errors gracefully in the load function
	}
}

const getAllGamesForPlaylist = async (eventFetch, playlistId) => {
	const playlistRes = await eventFetch(`/api/playlist/${playlistId}/games`);
	const games = await playlistRes.json();
	return games;
};

export async function load({ params, fetch, setHeaders }) {
	const { playlistId, gameSlug } = params;
	// ------------------ Get Playlist Data TODO ------------------
	// TODO: Only get All Playlist games, not all Games for this route
	const [allGames, game, favorites] = await Promise.all([
		getAllGamesForPlaylist(fetch, playlistId),
		fetchData(fetch, `/api/games/getSingleGame/${gameSlug}`),
		fetchData(fetch, `/api/favorites/${gameSlug}/getAllFavoritesSingleGame`)
	]);

	const { games = [] } = allGames;

	// Enhance game object with files and comments if available
	if (game) {
		const filesResponse = await fetchData(fetch, `/api/games/getSingleGame/${gameSlug}/files`);
		game.files = filesResponse ?? [];
		game.comments = (await getAllCommentsForAGame(fetch, gameSlug)) ?? [];
	}

	// Calculate top and bottom games
	const currentIndex = games?.findIndex((g) => g.id.toString() === gameSlug.toString());
	const topGame = currentIndex > 0 ? games[currentIndex - 1] : games[games.length - 1];
	const bottomGame = currentIndex < games.length - 1 ? games[currentIndex + 1] : games[0];

	setHeaders({
		'cache-control': 'max-age=604800'
	});

	return {
		...game,
		allGames: games,
		topGame,
		currentGame: game,
		bottomGame,
		comments: game?.comments ?? [],
		favorites: favorites ? { count: favorites.length, favorites } : { count: 0, favorites: [] },
		thumbnail: game?.thumbnail ?? ''
	};
}

export const actions = {
	// add a new playlist
	createPlaylist: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const isPublic = formData?.get('isPublic');
		const name = formData?.get('name');
		const description = formData?.get('description');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				isPublic,
				name,
				description
			})
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/playlist/create`, requestInit);

		const result = await response.json();

		// Return a response
		return {
			status: 200,
			body: {
				result
			}
		};
	}, //,
	updateDetails: async ({ cookies, request, params, setHeaders }) => {
		const token = cookies.get('token');
		const { slug } = params;
		const formData = await request.formData();

		const requestHeaders = new Headers();
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'PUT',
			mode: 'cors',
			headers: requestHeaders,
			body: formData
		};

		const authResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/update/${slug}`,
			requestInit
		);

		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to update project'
				}
			};
		}

		const project = await authResponse.json();

		setHeaders({
			'cache-control': 'no-store, max-age=0'
		});

		return {
			body: {
				project: project
			}
		};
	}
};
