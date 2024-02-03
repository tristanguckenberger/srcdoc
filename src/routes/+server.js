// @ts-nocheck
const getAllUsers = async () => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};
	let users = [];
	try {
		const usersResponse = await fetch(`${process.env.SERVER_URL}/api/users/all`, userReqInit);
		if (!usersResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to get all users',
					response: usersResponse
				}
			};
		}

		users = await usersResponse.json();
	} catch (error) {
		console.log('usersResponse::error::', error);
	}

	return users;
};

export async function GET({ params }) {
	// setHeaders({
	// 	'cache-control': 'max-age=60'
	// });

	const users = await getAllUsers();

	return new Response(
		JSON.stringify({
			body: {
				message: 'GET request received',
				params,
				users
			}
		})
	);
}
