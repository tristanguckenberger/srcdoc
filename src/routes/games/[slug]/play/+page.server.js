// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';

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

const getCurrentUser = async (eventFetch) => {
	let user;
	try {
		const userResponse = await eventFetch(`/api/users/getCurrentUser`);
		user = await userResponse.json();
	} catch (error) {
		console.log('getCurrentUser::error::', error);
	}

	return user;
};

async function getUser(fetch, id) {
	if (!id) return null;
	const user = await fetchData(fetch, `${process.env.SERVER_URL}/api/users/${id}`);
	if (!user) return { status: 401, body: { message: 'No User found with id provided' } };
	return user;
}

async function getAllCommentsForAGame(fetch, slug) {
	const commentsRaw = await fetchData(fetch, `${process.env.SERVER_URL}/api/comments/game/${slug}`);
	if (!commentsRaw) return [];

	const comments = await Promise.all(
		commentsRaw.map(async (comment) => {
			const user = await getUser(fetch, comment?.user_id);
			return {
				...comment,
				userName: user?.username,
				userAvatar: user?.profile_photo
			};
		})
	);

	return comments;
}

export async function load({ params, fetch, setHeaders }) {
	const { slug } = params;
	let user = null;
	let userGames = [];

	const [allGames, userData, game, favorites] = await Promise.all([
		fetchData(fetch, `/api/games/getAllGames`),
		getCurrentUser(fetch),
		fetchData(fetch, `/api/games/getSingleGame/${slug}`) ||
			gameData.find((g) => g.id.toString() === slug.toString()),
		fetchData(fetch, `/api/favorites/${slug}/getAllFavoritesSingleGame`)
	]);

	const { games = [] } = allGames;

	if (userData && userData?.status === 401) {
		user = null;
	}

	// Assuming user is already sanitized before being sent to the client
	if (userData?.id) {
		user = userData;
	}
	userGames = user?.id ? await fetchData(fetch, `/api/games/getAllGamesByUser/${user?.id}`) : [];

	// Enhance game object with files and comments if available
	if (game) {
		const filesResponse = await fetchData(fetch, `/api/games/getSingleGame/${slug}/files`);
		game.files = filesResponse ?? [];
		game.comments = (await getAllCommentsForAGame(fetch, slug)) ?? [];
	}

	// Calculate top and bottom games
	const currentIndex = games?.findIndex((g) => g.id.toString() === slug.toString());
	const topGame = currentIndex > 0 ? games[currentIndex - 1] : games[games.length - 1];
	const bottomGame = currentIndex < games.length - 1 ? games[currentIndex + 1] : games[0];

	setHeaders({
		'cache-control': 'max-age=604800'
	});

	return {
		...game,
		user,
		allGames: games,
		userGames: userGames?.reverse(),
		topGame,
		currentGame: { ...game },
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
	// search: async ({ fetch, request }) => {
	// 	const formData = await request.formData();
	// 	const query = formData?.get('query');
	// 	const searchResults = await fetch(`${process.env.SERVER_URL}/api/search/basic?q=${query}`);

	// 	if (!searchResults.ok) {
	// 		return {
	// 			status: 401,
	// 			body: {
	// 				message: 'Failed to search'
	// 			}
	// 		};
	// 	}

	// 	const result = await searchResults.json();

	// 	return {
	// 		result
	// 	};
	// }
};
