//@ts-nocheck
import { getSettings } from './api/utils/getFuncs.js';

export async function load({ fetch, cookies }) {
	const token = cookies?.get('token');
	const id = cookies?.get('userId');
	// const username = cookies?.get('username');

	if (token) {
		const settings = await getSettings(fetch);

		return {
			sessionData: {
				settings,
				id
				// username: JSON.parse(username)
				// ...sessionData,
				// token
			}
		};
	}

	return {
		sessionData: null
	};
}
