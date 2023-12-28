// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { commentData } from '$lib/mockData/commentData.js';
import { modalOpenState } from '$lib/stores/layoutStore.js';

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

	const game = await gameResponse.json();
	console.log('game::', game);
	return game;
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

	const commentResponse = await fetch(
		`${process.env.SERVER_URL}/api/comments/game/${slug}`,
		commentReqInit
	);
	if (!commentResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Request failed'
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

export async function load({ params }) {
	modalOpenState.set(false);
	const { slug } = params;

	const game =
		(await getSingleGame(slug)) ?? gameData.find((game) => game?.id.toString() === slug.toString());

	// find the game by slug
	const comments =
		(await getAllCommentsForAGame(slug)) ??
		commentData.filter((comment) => comment?.gameId.toString() === slug.toString());

	return {
		...game,
		comments: [...comments]
	};
}
