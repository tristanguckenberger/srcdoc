// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ setHeaders, params }) {
	const { slug } = params;

	console.log('slug::', slug);

	// const limit = url.searchParams.get('limit') ?? 50;
	// const offset = url.searchParams.get('offset') ?? 0;

	const commentReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: commentReqHeaders
	};

	// `${process.env.SERVER_URL}/api/comments/game/${gameId}?limit=${limit}&offset=${offset}`, for pagination later
	const commentResponse = await fetch(
		`${process.env.SERVER_URL}/api/comments/game/${slug}`,
		userReqInit
	);

	if (!commentResponse.ok) {
		return json({ comments: [], total: 0 });
	}

	const comments = await commentResponse.json();

	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json({ comments, total: comments?.length ?? 0 });
}
