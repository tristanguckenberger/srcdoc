// @ts-nocheck
export async function POST({ request, cookies }) {
	// Extract the data from the request body
	const data = await request.json();
	const token = cookies.get('token');
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);
	const requestInit = {
		method: 'PUT',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(data)
	};

	const { gameId, fileId, parentFileId } = data;

	if (!gameId || !token || !fileId) {
		return {
			status: 401,
			body: {
				message: 'Failed to update file'
			}
		};
	}

	if (!parentFileId) {
		return {
			status: 401,
			body: {
				message: 'Failed to update file, no parentFileId provided'
			}
		};
	}
	// // Here you would forward the data to your external Node Express server
	const response = await fetch(
		`${process.env.SERVER_URL}/api/games/${gameId}/files/${fileId}`,
		requestInit
	);

	if (!response.ok) {
		return {
			status: 401,
			body: {
				message: 'Unable to delete file'
			}
		};
	}

	// Return a response
	return new Response(
		JSON.stringify({
			status: 200,
			body: {
				message: 'file_deleted'
			}
		})
	);
}
