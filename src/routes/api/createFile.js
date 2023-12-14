// @ts-nocheck
export async function post(request) {
	// Extract the data from the request body
	const data = request.body;

	console.log(data);
	// // Here you would forward the data to your external Node Express server
	// const response = await fetch('http://your-node-express-server.com/endpoint', {
	//   method: 'POST',
	//   headers: {
	//     'Content-Type': 'application/json',
	//   },
	//   body: JSON.stringify(data),
	// });

	// const result = await response.json();

	// Return a response
	return {
		status: 200,
		body: data
	};
}
