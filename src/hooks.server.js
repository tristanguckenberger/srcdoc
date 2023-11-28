// @ts-nocheck
// export async function handle({ event, resolve }) {
// 	// console.log('request:hooks.server.js:', info);
// 	console.log('env', process.env.SERVER_URL);
// 	if (event?.request?.url?.includes('/api/authenticate')) {
// 		console.log('request:hooks.server.js:', event?.request);
// 		const request = new Request(process.env.SERVER_URL + '/login', event?.request, {
// 			'Content-Type': 'application/json'
// 		});
// 		// fetch(request, {
// 		// 	Headers: {
// 		// 		'Content-Type': 'application/json'
// 		// 	}
// 		// });
// 		return new Response(JSON.stringify({ ...request }));
// 	}
// 	const response = await resolve(event);
// 	return response;
// }

export async function handle({ event, resolve }) {
	// console.log('request:hooks.server.js:', info);
	const fetch = event.fetch;
	console.log('env', process.env.SERVER_URL);
	if (event?.request?.url?.includes('/api/authenticate')) {
		console.log('request:hooks.server.js:', event?.request);
		const request = new Request(process.env.SERVER_URL + '/login', event?.request, {
			'Content-Type': 'application/json'
		});

		fetch(request, {
			Headers: {
				'Content-Type': 'application/json'
			}
		});
		return new Response(JSON.stringify({ ...request }));
	}
	const response = await resolve(event);
	return response;
}
