import { getSettings } from './api/utils/getFuncs.js';

export async function load({ fetch }) {
	// const token = cookies?.get('token');
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

	const settings = await getSettings(fetch);

	return {
		sessionData: {
			settings
			// ...sessionData,
			// token
		}
	};
}
