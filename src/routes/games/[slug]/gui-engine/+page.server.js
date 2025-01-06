// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';

const getSingleGame = async (slug, token) => {
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

		// if there are no files, create a root file
		if (gameFiles?.length === 0 || !gameFiles) {
			const newFileHeaders = new Headers();
			newFileHeaders?.append('Content-Type', 'application/json');
			newFileHeaders?.append('Authorization', `Bearer ${token}`);
			const gameFilesReqInit = {
				method: 'POST',
				headers: newFileHeaders,
				mode: 'cors',
				body: JSON.stringify({
					name: 'root',
					type: 'folder'
				})
			};

			const addFileResponse = await fetch(
				`${process.env.SERVER_URL}/api/games/${gameInfo?.id}/files`,
				gameFilesReqInit
			);

			if (!addFileResponse.ok) {
				return {
					status: 401,
					body: {
						message: 'Game Creation failed'
					}
				};
			}

			const gameFiles = await addFileResponse.json();
			gameInfo.files = [gameFiles] ?? [];
		} else {
			gameInfo.files = gameFiles ?? [];
		}
	}

	return gameInfo;
};

export async function load({ params, cookies, setHeaders }) {
	const { slug } = params;
	const token = cookies.get('token');

	// find the game by slug
	const game =
		(await getSingleGame(slug, token)) ??
		gameData.find((game) => game?.id.toString() === slug?.toString());
	setHeaders({
		'cache-control': 'max-age=60'
	});
	return {
		...game
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
	},
	search: async ({ fetch, request }) => {
		const formData = await request.formData();
		const query = formData?.get('query');
		const searchResults = await fetch(`${process.env.SERVER_URL}/api/search/basic?q=${query}`);

		if (!searchResults.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to search'
				}
			};
		}

		const result = await searchResults.json();

		return {
			result
		};
	}
};
