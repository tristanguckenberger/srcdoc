// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ cookies, params }) {
	console.log(':::::::::::::::::::HIT AddGameToPlaylist API route:::::::::::::::::::');
	const token = cookies.get('token');

	const playlistSlug = params.slug;
	const gameSlug = params.game_slug;

	console.log('AddGameToPlaylist::playlistSlug::', playlistSlug);
	console.log('AddGameToPlaylist::gameSlug::', gameSlug);
	console.log('AddGameToPlaylist::token::', token);

	// const requestHeaders = new Headers();
	// requestHeaders.append('Content-Type', 'application/json');
	// requestHeaders.append('Authorization', `Bearer ${token}`);
	// const requestInit = {
	// 	method: 'POST',
	// 	headers: requestHeaders
	// };

	// const response = await fetch(
	// 	`${process.env.SERVER_URL}/api/playlist/${playlistSlug}/add/${gameSlug}`,
	// 	requestInit
	// );

	const result = 'howdy'; //await response.json();

	// Return a response
	return json(result);
}
