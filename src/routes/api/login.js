// @ts-nocheck
export async function POST(request) {
	// Extract user credentials from request
	const credentials = JSON.parse(request);

	// Perform authentication logic...
	fetch('/api/authenticate', {
		method: 'POST',
		body: JSON.stringify(credentials)
	});

	//Return a response
	return {
		status: 200,
		body: {
			message: 'Login successful'
		}
	};
}
