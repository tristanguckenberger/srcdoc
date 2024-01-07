// @ts-nocheck
import { session } from '$lib/stores/sessionStore';

export async function load({ cookies }) {
	const token = cookies?.get('token');
	let sessionData = null;
	session.subscribe(async (session) => {
		try {
			if (session && token) {
				sessionData = session;
			}
		} catch (error) {
			console.log('error::', error);
		}
	});

	return {
		sessionData
	};
}
