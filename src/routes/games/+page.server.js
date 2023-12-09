// @ts-nocheck
import { gameData } from '$lib/mockData/gameData.js';
import { session } from '$lib/stores/sessionStore.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	session.subscribe(async (session) => {
		try {
			session?.token && cookies.set('token', session?.token);
		} catch (error) {
			console.log('error::', error);
		}
	});

	const getCurrentUser = async () => {
		const token = cookies.get('token');
		if (token) {
			const userReqHeaders = new Headers();
			userReqHeaders?.append('Authorization', `Bearer ${token}`);
			const userReqInit = {
				method: 'GET',
				headers: userReqHeaders
			};

			const userResponse = await fetch(`${process.env.SERVER_URL}/api/users/me`, userReqInit);
			if (!userResponse.ok) {
				return {
					status: 401,
					body: {
						message: 'Authentication failed'
					}
				};
			}

			const user = await userResponse.json();
			return user;
		}
	};

	const user = await getCurrentUser();

	if (user && !user?.is_active) {
		throw redirect(300, `/users/${user?.id}/verify`);
	}

	session.set({
		...user,
		password: ''
	});

	return {
		games: [...gameData],
		sessionData: {
			...user,
			password: ''
		}
	};
}
