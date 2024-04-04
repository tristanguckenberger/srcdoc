// @ts-nocheck
// Potentially not in use - delete after review
import { json } from '@sveltejs/kit';

export async function GET() {
	// const token = cookies.get('token');

	// const playlistSlug = params.slug;
	// const gameSlug = params.game_slug;

	const result = 'howdy'; //await response.json();

	// Return a response
	return json(result);
}
