//@ts-nocheck
import { getFollowers, getFollowing } from './api/utils/getFuncs.js';

export async function load({ fetch, cookies }) {
	const token = cookies?.get('token');
	const userId = cookies?.get('userId');
	const isActive = cookies?.get('isActive');
	const username = cookies?.get('username');

	if (token) {
		const followers = await getFollowers(fetch, userId);
		const following = await getFollowing(fetch, userId);

		return {
			followers,
			following,
			isActive: JSON.parse(isActive),
			username: JSON.parse(username),
			userId
		};
	}

	return {
		followers: null,
		following: null,
		isActive: false,
		username: null,
		userId: null
	};
}
