// @ts-nocheck
const getAllUsers = async () => {
	const userReqHeaders = new Headers();
	const userReqInit = {
		method: 'GET',
		headers: userReqHeaders
	};

	const usersResponse = await fetch(`${process.env.SERVER_URL}/api/users/all`, userReqInit);
	if (!usersResponse.ok) {
		return {
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		};
	}

	const users = await usersResponse.json();
	return users;
};

export async function GET({ params }) {
	console.log('GET::', params);

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
