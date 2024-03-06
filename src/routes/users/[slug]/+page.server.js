// @ts-nocheck

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

export async function load({ params, setHeaders }) {
	const { slug } = params;
	const user = await getUser(slug);

	if (user?.id) {
		delete user.password;
		delete user.email;
	}

	setHeaders({
		'cache-control': 'max-age=604800'
	});
	return {
		...user
	};
}
export const actions = {
	// add a new playlist
	createPlaylist: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const isPublic = formData?.get('isPublic');
		const name = formData?.get('name');
		const description = formData?.get('description');
		const requestHeaders = new Headers();

		requestHeaders.append('Content-Type', 'application/json');
		requestHeaders.append('Authorization', `Bearer ${token}`);

		const requestInit = {
			method: 'POST',
			headers: requestHeaders,
			mode: 'cors',
			body: JSON.stringify({
				isPublic,
				name,
				description
			})
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/playlist/create`, requestInit);

		const result = await response.json();

		// Return a response
		return {
			status: 200,
			body: {
				result
			}
		};
	},
	updateUserDetails: async ({ cookies, request, params }) => {
		const token = cookies.get('token');
		const { slug } = params;

		// console.log('updateUserDetails::slug::', slug);

		const formData = await request.formData();
		const requestHeaders = new Headers();
		requestHeaders.append('Authorization', `Bearer ${token}`);

		// console.log('formData::', formData);

		const requestInit = {
			method: 'PUT',
			mode: 'cors',
			headers: requestHeaders,
			body: formData
		};

		const response = await fetch(`${process.env.SERVER_URL}/api/users/update/${slug}`, requestInit);

		if (!response.ok) {
			console.error('Failed to update user details:', response.statusText);
			return {
				status: response.status,
				body: {
					message: 'Failed to update user details'
				}
			};
		}

		const user = await response.json();
		// console.log('Updated user:', user);

		return {
			body: user
		};

		// const { slug } = params;

		// const formData = await request.formData();
		// const file = formData.get('profilePhoto');
		// const id = formData?.get('id');
		// const username = formData?.get('username');
		// const profilePhoto = formData?.get('profile_photo');
		// const bio = formData?.get('bio');

		// console.log('formData::', formData);

		// const requestHeaders = new Headers();
		// requestHeaders.append('Content-Type', 'application/json');
		// requestHeaders.append('Authorization', `Bearer ${token}`);
		// const requestInit = {
		// 	method: 'PUT',
		// 	headers: requestHeaders,
		// 	mode: 'cors',
		// 	body: JSON.stringify({
		// 		username,
		// 		profilePhoto,
		// 		bio
		// 	})
		// };

		// const authResponse = await fetch(
		// 	`${process.env.SERVER_URL}/api/users/update/${id}`,
		// 	requestInit
		// );

		// if (!authResponse.ok) {
		// 	console.log('authResponse::user::');
		// 	console.log('authResponse::user::FAILED::', authResponse);
		// 	return {
		// 		status: 401,
		// 		body: {
		// 			message: 'Failed to update user'
		// 		}
		// 	};
		// }
		// console.log('authResponse::user::OKAY::');

		// const user = {}; //await authResponse.json();
		// console.log('authResponse::user::', user);

		// return {
		// 	body: {
		// 		...user
		// 	}
		// };
	}
};
