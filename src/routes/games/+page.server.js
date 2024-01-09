// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { gamesData } from '$lib/stores/gamesStore.js';
// import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

const getCurrentUser = async (eventFetch) => {
	const userResponse = await eventFetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();

	return user;
};

const getAllFavoritesSingleGame = async (slug, eventFetch) => {
	const favoritesRes = await eventFetch(`/api/favorites/${slug}/getAllFavoritesSingleGame`);
	const favorites = await favoritesRes.json();

	return favorites;
};

export async function load({ cookies, fetch }) {
	const token = cookies?.get('token');

	if (!token) {
		return {
			games: [...gameData].reverse()
		};
	}

	let sessionData;

	if (token && !sessionData) {
		const user = await getCurrentUser(fetch);
		sessionData = {
			...user
		};

		delete sessionData?.token && delete sessionData?.password;
	}

	gamesData.set([...gameData].reverse());

	return {
		games: [...gameData].reverse()
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

		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);
		const requestInit = {
			method: 'PUT',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				title,
				description
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
