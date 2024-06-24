//@ts-nocheck
import { getSettings, getCurrentUser, getFollowers, getFollowing } from './api/utils/getFuncs.js';

export async function load({ fetch, cookies }) {
	const token = cookies?.get('token');
	// const username = cookies?.get('username');
	let currentUser;
	let settings;

	if (token) {
		// if (!username) {
		settings = await getSettings(fetch);
		currentUser = await getCurrentUser(fetch);
		cookies.set('username', JSON.stringify(currentUser?.username), {
			path: '/'
		});
		// }
		const followers = await getFollowers(fetch, currentUser?.id);
		const following = await getFollowing(fetch, currentUser?.id);

		return {
			settings,
			currentUser,
			followers,
			following
		};
	}

	return {
		settings: null,
		currentUser: null,
		followers: null,
		following: null
	};
}
