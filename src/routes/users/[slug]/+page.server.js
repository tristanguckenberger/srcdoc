// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { getFollowers, getFollowing } from '../../api/utils/getFuncs.js';

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

export async function load({ params, setHeaders, fetch, cookies }) {
	const { slug } = params;
	const user = await getUser(slug);

	if (user?.id) {
		delete user.password;
		delete user.email;
	} else {
		throw redirect(303, '/games');
	}

	const followers = await getFollowers(fetch, user?.id);
	const following = await getFollowing(fetch, user?.id);
	const currentUser = cookies.get('userId');

	setHeaders({
		'cache-control': 'max-age=604800'
	});

	return {
		...user,
		followers,
		following,
		currentUser
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

		const formData = await request.formData();
		const requestHeaders = new Headers();
		requestHeaders.append('Authorization', `Bearer ${token}`);

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
		return {
			body: user
		};
	},
	search: async ({ fetch, request }) => {
		const formData = await request.formData();
		const query = formData?.get('query');
		const searchResults = await fetch(`${process.env.SERVER_URL}/api/search/basic?q=${query}`);

		if (!searchResults.ok) {
			return {
				status: 401,
				body: {
					message: 'Failed to search'
				}
			};
		}

		const result = await searchResults.json();

		return {
			result
		};
	}
};
