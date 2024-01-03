// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { gamesData } from '$lib/stores/gamesStore.js';
import { session } from '$lib/stores/sessionStore.js';

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

	const gameInfo = await gameResponse.json();

	if (gameInfo?.id) {
		const gameFilesHeaders = new Headers();
		gameFilesHeaders?.append('Content-Type', 'application/json');
		const gameFilesReqInit = {
			method: 'GET',
			headers: gameFilesHeaders
		};

		const gameFilesResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/${gameInfo?.id}/files`,
			gameFilesReqInit
		);
		if (!gameFilesResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			};
		}

		const gameFiles = await gameFilesResponse.json();
		gameInfo.files = gameFiles ?? [];
	}

	return gameInfo;
};

const getCurrentUser = async (cookies) => {
	const token = cookies.get('token');
	if (token) {
		const userReqHeaders = new Headers();
		userReqHeaders?.append('Authorization', `Bearer ${token}`);
		const userReqInit = {
			method: 'GET',
			headers: userReqHeaders
		};

		const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/me`, userReqInit);
		if (!userResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			};
		}

		const user = await userResponse.json();
		return user;
	}
};

const getAllGamesByUser = async (userId) => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const userResponse = await fetch(
		`${process.env.SERVER_URL}/api/games/user/${userId}`,
		userReqInit
	);
	if (!userResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		};
	}

	const games = await userResponse.json();
	return games;
};

export async function load({ cookies, params }) {
	const { slug } = params;
	session.subscribe(async (session) => {
		try {
			const token = cookies?.get('token');
			if (session?.token && !token) {
				cookies?.set('token', session?.token);
			}
		} catch (error) {
			console.log('error::', error);
		}
	});

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

	const user = await getCurrentUser(cookies);
	let userGames;

	if (user) {
		userGames = await getAllGamesByUser(params?.slug);
	}

	const baseGames = [...gameData].reverse();

	const game =
		(await getSingleGame(slug)) ?? gameData.find((game) => game?.id.toString() === slug.toString());

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
		fetchedTopGame = await getSingleGame(topGame?.id);
	}

	if (bottomGame) {
		fetchedBottomGame = await getSingleGame(bottomGame?.id);
	}

	return {
		...game,
		currentGame: { ...game },
		topGame: { ...topGame, ...fetchedTopGame },
		bottomGame: { ...bottomGame, ...fetchedBottomGame },
		baseGames,
		userGames
	};
}
