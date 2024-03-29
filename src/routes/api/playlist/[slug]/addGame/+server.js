// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ cookies, params, request }) {
	console.log(':::::::::::::::::::HIT AddGameToPlaylist API route:::::::::::::::::::');
	const token = cookies.get('token');

	const body = await request.json();
	const playlistSlug = params.slug;
	const gameId = body?.gameId;

	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'POST',
		headers: requestHeaders
	};

	const response = await fetch(
		`${process.env.SERVER_URL}/api/playlist/${playlistSlug}/add/${gameId}`,
		requestInit
	);

	const result = await response.json();

	// Return a response
	return json(result);
}
