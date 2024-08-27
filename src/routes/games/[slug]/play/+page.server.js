// @ts-nocheck
import { put } from '@vercel/blob';

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

export async function load({ setHeaders, params, fetch }) {
	const { slug } = params;
	const limit = 5;

	const [gameRange] = await Promise.all([
		fetchData(fetch, `/api/games/slider?limit=${limit || 5}&currentGame=${slug}`)
	]);

	const { games = [], total = 0 } = gameRange;

	// Calculate top and bottom games
	const currentIndex = games?.findIndex((g) => g.id.toString() === slug.toString());
	const topGame = currentIndex > 0 ? games[currentIndex - 1] : games[games.length - 1];
	const bottomGame = currentIndex < games.length - 1 ? games[currentIndex + 1] : games[0];

	setHeaders({
		'cache-control': 'max-age=604800'
	});

	const game = games.find((g) => g.id.toString() === slug.toString());

	const allGamesIds = games.map((g) => g.id);

	return {
		...game,
		allGames: games,
		total: parseInt(total, 10),
		topGame,
		currentGame: { ...game },
		bottomGame,
		allGamesIds
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
	updateDetails: async ({ cookies, request, params, fetch }) => {
		const token = cookies.get('token');
		const { slug } = params;
		const formData = await request.formData();
		const thumbnail = formData.get('thumbnail');
		const published = formData.get('published');
		const title = formData.get('title');
		const description = formData.get('description');
		const gameId = formData.get('gameId');
		let thumbnailURL;

		if (thumbnail) {
			try {
				const { url } = await put(thumbnail.name, thumbnail, { access: 'public' });
				thumbnailURL = url;
			} catch (error) {
				console.log('error uploading photo::', error);
			}
		}

		const requestHeaders = new Headers();
		requestHeaders.append('Authorization', `Bearer ${token}`);
		requestHeaders.append('Content-Type', 'application/json');
		const body = JSON.stringify({
			published,
			title,
			description,
			gameId,
			thumbnail: thumbnailURL
		});

		const requestInit = {
			method: 'PUT',
			mode: 'cors',
			headers: requestHeaders,
			body
		};

		const authResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/update/${slug}`,
			requestInit
		);

		if (!authResponse.ok) {
			return {
				status: authResponse.status,
				body: {
					message: 'Failed to update project details'
				}
			};
		}

		const project = await authResponse.json();

		// setHeaders({
		// 	'cache-control': 'no-store, max-age=0'
		// });

		return {
			body: {
				project: project
			}
		};
	},
	getAllReviewsForGame: async ({ params, setHeaders }) => {
		const { slug } = params;
		const reviews = await fetchData(fetch, `${process.env.SERVER_URL}/api/reviews/games/${slug}`);

		setHeaders({
			'cache-control': 'no-store, max-age=0'
		});
		return reviews;
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
