// @ts-nocheck
// FILE POTENTIALLY NOT IN USE - DELETE AFTER REVIEW
export async function post(request) {
	// Extract the data from the request body
	const data = request.body;

	// Return a response
	return {
		status: 200,
		body: data
	};
}
