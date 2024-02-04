// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { gamesData } from '$lib/stores/gamesStore.js';

const getAllFavoritesSingleGame = async (slug, eventFetch) => {
	let favorites;
	try {
		const favoritesRes = await eventFetch(`/api/favorites/${slug}/getAllFavoritesSingleGame`);
		favorites = await favoritesRes.json();
	} catch (error) {
		console.log('favoritesRes::error::', error);
	}

	return favorites;
};

const getAllFilesBySingleGame = async (slug, eventFetch) => {
	let gameFiles;
	try {
		const gameFilesRes = await eventFetch(`/api/games/getSingleGame/${slug}/files`);
		gameFiles = await gameFilesRes.json();
	} catch (error) {
		console.log('gameFilesRes::error::', error);
	}

	return gameFiles;
};

const getSingleGame = async (slug, eventFetch) => {
	let gameResponse;
	let gameInfo;
	try {
		gameResponse = await eventFetch(`/api/games/getSingleGame/${slug}`);
		gameInfo = await gameResponse.json();
	} catch (error) {
		console.log('error::', error);
	}

	return gameInfo;
};

const getCurrentUser = async (eventFetch) => {
	let user;

	try {
		const userResponse = await eventFetch(`/api/users/getCurrentUser`);
		user = await userResponse.json();

		if (user?.status === 401) {
			return null;
		}
	} catch (error) {
		console.log('getCurrentUser::error::', error);
	}

	return user;
};

const getAllGamesByUser = async (userId, eventFetch) => {
	let games = [];
	try {
		const gamesRes = await eventFetch(`/api/games/getAllGamesByUser/${userId}`);
		games = await gamesRes.json();
	} catch (error) {
		console.log('gamesRes::error::', error);
	}

	return games;
};

const getUser = async (/** @type {String} */ id) => {
	if (id) {
		const userReqHeaders = new Headers();
		userReqHeaders?.append(`content-type`, `application/json`);
		const userReqInit = {
			method: 'GET',
			headers: userReqHeaders
		};

		const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/${id}`, userReqInit);
		if (!userResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'No User found with id provided'
				}
			};
		}

		const user = await userResponse.json();
		return user;
	}
};

const getAllCommentsForAGame = async (slug) => {
	const commentReqHeaders = new Headers();
	const commentReqInit = {
		method: 'GET',
		headers: commentReqHeaders
	};
	let commentResponse;
	try {
		commentResponse = await fetch(
			`${process.env.SERVER_URL}/api/comments/game/${slug}`,
			commentReqInit
		);
	} catch (error) {
		console.log('commentResponse::error::', error);
	}

	if (!commentResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Request failed',
				data: []
			}
		};
	}

	const commentsRaw = await commentResponse.json();
	const comments = commentsRaw.map(async (comment) => {
		const user = await getUser(comment?.user_id);
		return {
			id: comment?.id,
			userId: comment?.user_id,
			userName: user?.username,
			userAvatar: user?.profile_photo,
			gameId: comment?.game_id,
			parentCommentId: comment?.parent_comment_id,
			commentText: comment?.comment_text
		};
	});
	return Promise.all(comments);
};

export async function load(/**{ params, fetch }**/ { params, fetch }) {
	const { slug } = params;

	let allGames;

	gamesData?.subscribe(async (gamesData) => {
		try {
			if (!gamesData?.length) {
				const gamesReqHeaders = new Headers();
				const gamesReqInit = {
					method: 'GET',
					headers: gamesReqHeaders
				};
				const gamesResponse = await fetch(`${process.env.SERVER_URL}/api/games`, gamesReqInit);
				const games = await gamesResponse.json();
				gamesData = games;
			}

			allGames = gamesData;
		} catch (error) {
			console.log('error::', error);
		}
	});

	const user = await getCurrentUser(fetch);

	const sessionData = {
		...user
	};

	delete sessionData?.token && delete sessionData?.password;

	let userGames = [];
	if (user) {
		userGames = await getAllGamesByUser(user?.id, fetch);
	}

	const game =
		(await getSingleGame(slug, fetch)) ??
		gameData.find((game) => game?.id.toString() === slug.toString());

	if (game?.id) {
		const gameFiles = await getAllFilesBySingleGame(game?.id ?? slug, fetch);
		game.files = gameFiles ?? [];
	}

	const favorites = await getAllFavoritesSingleGame(slug, fetch);

	let comments = await getAllCommentsForAGame(slug);

	const currentIndexByGameID = allGames?.findIndex(
		(gam) => gam?.id?.toString() === game?.id?.toString()
	);
	const currentIndexIsLast = allGames?.length - 1 === currentIndexByGameID;
	const currentIndexIsFirst = 0 === currentIndexByGameID;

	let topGame;
	let fetchedTopGame;
	let favsObj;

	let bottomGame;
	let fetchedBottomGame;

	if (currentIndexIsLast) {
		topGame = allGames[currentIndexByGameID - 1];
		bottomGame = allGames[0];
	} else if (currentIndexIsFirst) {
		topGame = allGames[allGames?.length - 1];
		bottomGame = allGames[currentIndexByGameID + 1];
	} else {
		topGame = allGames[currentIndexByGameID - 1];
		bottomGame = allGames[currentIndexByGameID + 1];
	}

	if (topGame) {
		fetchedTopGame = await getSingleGame(topGame?.id, fetch);
	}

	if (bottomGame) {
		fetchedBottomGame = await getSingleGame(bottomGame?.id, fetch);
	}

	if (!comments?.length || comments?.length === 0) {
		console.log('no comments');
		comments = [];
	}

	if (favorites?.length) {
		favsObj = {
			count: favorites?.length,
			favorites: [...favorites]
		};
	}

	return {
		...game,
		text: 'howdy',
		user,
		// slug,
		allGames,
		currentGame: { ...game },
		topGame: { ...topGame, ...fetchedTopGame },
		bottomGame: { ...bottomGame, ...fetchedBottomGame },
		// baseGames,
		userGames: [...userGames].reverse(),
		comments: [...comments],
		favorites: { ...favsObj }
	};
}
