import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { slug } = params;

	const gameFilesHeaders = new Headers();
	gameFilesHeaders?.append('Content-Type', 'application/json');
	const gameFilesReqInit = {
		method: 'GET',
		headers: gameFilesHeaders
	};

	const gameFilesResponse = await fetch(
		`${process.env.SERVER_URL}/api/games/${slug}/files`,
		gameFilesReqInit
	);
	if (!gameFilesResponse.ok) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const files = await gameFilesResponse.json();

	return json([...files]);
}
