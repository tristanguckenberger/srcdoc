import { getCurrentUser, getSettings } from './api/utils/getFuncs.js';

export async function load({ fetch, cookies }) {
	const token = cookies?.get('token');
	// let sessionData = null;
	// session.subscribe(async (session) => {
	// 	try {
	// 		if (session && token) {
	// 			sessionData = session;
	// 		}
	// 	} catch (error) {
	// 		console.log('error::', error);
	// 	}
	// });

	if (token) {
		const settings = await getSettings(fetch);
		const user = await getCurrentUser(fetch);

		return {
			sessionData: {
				settings,
				...user
				// ...sessionData,
				// token
			}
		};
	}

	return {
		sessionData: null
	};
}
