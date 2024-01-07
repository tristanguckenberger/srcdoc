// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { gamesData } from '$lib/stores/gamesStore.js';

const getAllFilesBySingleGame = async (slug, eventFetch) => {
	const gameFilesRes = await eventFetch(`/api/games/getSingleGame/${slug}/files`);
	const gameFiles = await gameFilesRes.json();

	return gameFiles;
};

const getSingleGame = async (slug, eventFetch) => {
	const gameResponse = await eventFetch(`/api/games/getSingleGame/${slug}`);
	const gameInfo = await gameResponse.json();
	return gameInfo;
};

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();
	return user;
};

const getAllGamesByUser = async (userId, eventFetch) => {
	const gamesRes = await eventFetch(`/api/games/getAllGamesByUser/${userId}`);
	const games = await gamesRes.json();

	return games;
};

export async function load({ params, fetch }) {
	const { slug } = params;

	let allGames = [];
	gamesData.subscribe(async (gamesData) => {
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
	let userGames = [];
	if (user) {
		userGames = await getAllGamesByUser(user?.id, fetch);
	}

	const baseGames = [...gameData].reverse();
	const game =
		(await getSingleGame(slug, fetch)) ??
		gameData.find((game) => game?.id.toString() === slug.toString());

	if (game?.id) {
		const gameFiles = await getAllFilesBySingleGame(game?.id ?? slug, fetch);
		game.files = gameFiles ?? [];
	}

	const currentIndexByGameID = allGames?.findIndex(
		(gam) => gam?.id?.toString() === game?.id?.toString()
	);
	const currentIndexIsLast = allGames?.length - 1 === currentIndexByGameID;
	const currentIndexIsFirst = 0 === currentIndexByGameID;

	let topGame;
	let fetchedTopGame;

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

	return {
		...game,
		currentGame: { ...game },
		topGame: { ...topGame, ...fetchedTopGame },
		bottomGame: { ...bottomGame, ...fetchedBottomGame },
		baseGames,
		userGames: [...userGames].reverse() ?? []
	};
}
