// @ts-nocheck
import { gamesData } from '$lib/stores/gamesStore.js';
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

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

const getAllFavoritesSingleGame = async (slug, eventFetch) => {
	let favorites = [];
	try {
		const favoritesRes = await eventFetch(`/api/favorites/${slug}/getAllFavoritesSingleGame`);
		favorites = await favoritesRes.json();
	} catch (error) {
		console.log('favoritesRes::error::', error);
	}

	return favorites;
};

export async function load({ fetch, setHeaders }) {
	let user = null;
	const [allGames, userData] = await Promise.all([
		fetchData(fetch, `/api/games/getAllGames`),
		getCurrentUser(fetch)
	]);

	// console.log('play_load::user::', user);
	if (userData && userData?.status === 401) {
		user = null;
	}

	// Assuming user is already sanitized before being sent to the client
	if (userData?.id) {
		user = userData;
	}

	const publishedGames = allGames?.filter((game) => game.published);
	gamesData.set([...publishedGames].reverse());

	setHeaders({
		'cache-control': 'max-age=60'
	});

	return {
		games: [...publishedGames].reverse(),
		user
	};
}

export const actions = {
	addProject: async ({ cookies }) => {
		const token = cookies.get('token');
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors'
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/games/create`, requestInit);
		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to create new project'
				}
			};
		}

		const project = await authResponse.json();

		if (project?.id) {
			throw redirect(302, `/games/${project?.id}/play`);
		}
		return {
			status: 302,
			redirect: `/games/${project?.id}/play`,
			body: {
				message: 'add_project_success',
				project: project
			}
		};
	},
	updateDetails: async ({ cookies, request }) => {
		const token = cookies.get('token');

		const formData = await request.formData();
		const gameId = formData?.get('gameId');
		const title = formData?.get('title');
		const description = formData?.get('description');
		const published = formData?.get('published');

		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				title,
				description,
				published
			})
		};

		const authResponse = await fetch(
			`${process.env.SERVER_URL}/api/games/update/${gameId}`,
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

		console.log('authResponse::project::');

		const project = await authResponse.json();

		return {
			body: {
				project: project
			}
		};
	},
	addNewComment: async ({ cookies, request }) => {
		const token = cookies.get('token');

		const formData = await request.formData();
		const gameId = formData?.get('gameId');
		const commentText = formData?.get('comment');

		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				gameId,
				commentText,
				parentCommentId: null
			})
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/comments/create`, requestInit);

		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to add comment'
				}
			};
		}

		const newComment = await authResponse.json();

		return {
			status: 200,
			body: {
				message: 'add_comment_success',
				project: newComment
			}
		};
	},
	updateComment: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const commentId = formData?.get('commentId');
		const commentText = formData?.get('commentText');
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				comment_text: commentText
			})
		};

		const authResponse = await fetch(
			`${process.env.SERVER_URL}/api/comments/update/${commentId}`,
			requestInit
		);

		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to update comment'
				}
			};
		}

		const updatedComment = await authResponse.json();

		return {
			status: 200,
			body: {
				message: 'update_comment_success',
				project: updatedComment
			}
		};
	},
	addNewReply: async ({ cookies, request }) => {
		const token = cookies.get('token');

		const formData = await request.formData();
		const gameId = formData?.get('gameId');
		const commentText = formData?.get('commentText');
		const parentCommentId = formData?.get('parentCommentId');

		if (!parentCommentId) {
			return {
				status: 401,
				body: {
					message: 'Failed to add comment'
				}
			};
		}

		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				gameId,
				commentText,
				parentCommentId
			})
		};

		const authResponse = await fetch(`${process.env.SERVER_URL}/api/comments/create`, requestInit);

		if (!authResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to add comment'
				}
			};
		}

		const newComment = await authResponse.json();

		return {
			status: 200,
			body: {
				message: 'add_comment_success',
				project: newComment
			}
		};
	},
	createFavorite: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const gameId = formData?.get('gameId');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				gameId
			})
		};

		const favResponse = await fetch(`${process.env.SERVER_URL}/api/favorites/add`, requestInit);

		if (!favResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to create new favorite'
				}
			};
		}

		const favorites = await getAllFavoritesSingleGame(gameId, fetch);

		return {
			status: 200,
			body: {
				message: 'create_fav_success',
				favorited: true,
				favorites
			}
		};
	},
	deleteFavorite: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const id = formData?.get('gameId');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'DELETE',
			headers: requestHeaders,
			mode: 'cors'
		};

		const favResponse = await fetch(
			`${process.env.SERVER_URL}/api/favorites/delete/${id}`,
			requestInit
		);
		console.log('favResponse::', favResponse);

		if (!favResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to create new project'
				}
			};
		}

		const favorites = await getAllFavoritesSingleGame(id, fetch);

		return {
			status: 200,
			body: {
				message: 'create_fav_success',
				favorited: true,
				favorites
			}
		};
	}
};
