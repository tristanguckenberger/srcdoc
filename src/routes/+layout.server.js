//@ts-nocheck
import { getSettings, getCurrentUser } from './api/utils/getFuncs.js';

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

		return {
			settings,
			currentUser
		};
	}

	return {
		settings: null,
		currentUser: null
	};
}
