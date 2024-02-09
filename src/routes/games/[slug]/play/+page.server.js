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
	const currentIndex = allGames?.findIndex((g) => g.id.toString() === slug.toString());
	const topGame = currentIndex > 0 ? allGames[currentIndex - 1] : allGames[allGames.length - 1];
	const bottomGame = currentIndex < allGames.length - 1 ? allGames[currentIndex + 1] : allGames[0];

	setHeaders({
		'cache-control': 'max-age=604800'
	});

	return {
		...game,
		user,
		allGames,
		userGames: userGames?.reverse(),
		topGame,
		currentGame: { ...game },
		bottomGame,
		comments: game?.comments ?? [],
		favorites: favorites ? { count: favorites.length, favorites } : { count: 0, favorites: [] }
	};
}
