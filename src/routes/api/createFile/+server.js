// @ts-nocheck
export async function POST({ request, cookies }) {
	// Extract the data from the request body
	const data = await request.json();
	const token = cookies.get('token') ?? localStorage?.getItem('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'POST',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(data)
	};

	const { gameId } = data;

	if (!gameId) {
		return {
			status: 401,
			body: {
				message: 'Failed to add file'
			}
		};
	}
	// // Here you would forward the data to your external Node Express server
	const response = await fetch(`${process.env.SERVER_URL}/api/games/${gameId}/files`, requestInit);

	const result = await response.json();

	// Return a response
	return new Response(
		JSON.stringify({
			status: 200,
			body: {
				message: 'file_created',
				result
			}
		})
	);
}
