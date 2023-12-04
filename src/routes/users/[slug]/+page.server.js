// import { userData } from '$lib/mockData/userData.js';

const getUser = async (/** @type {String} */ id) => {
	if (id) {
		const userReqHeaders = new Headers();
		userReqHeaders?.append(`content-type`, `application/json`);
		const userReqInit = {
			method: 'GET',
			headers: userReqHeaders
		};

		const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/${id}`, userReqInit);
		if (!userResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'No User found with id provided'
				}
			};
		}

		const user = await userResponse.json();
		return user;
	}
};

export async function load({ params }) {
	const { slug } = params;

	console.log('slug::', slug);

	// find the user by slug
	const user = await getUser(slug); // userData.find((user) => user?.id.toString() === slug.toString());

	return {
		...user
	};
}
