// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function GET({ cookies, setHeaders }) {
	const token = cookies?.get('token');
	const requestHeaders = new Headers();

	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('Authorization', `Bearer ${token}`);

	const settingsReqInit = {
		method: 'GET',
		headers: requestHeaders
	};

	let settings;
	try {
		const settingsResponse = await fetch(
			`${process.env.SERVER_URL}/api/settings/me`,
			settingsReqInit
		);
		if (!settingsResponse.ok) {
			cookies.delete('token', { path: '/' });
			cookies.delete('isActive', { path: '/' });
			cookies.delete('profile_photo', { path: '/' });
			cookies.delete('userId', { path: '/' });
			cookies.delete('username', { path: '/' });
			return json({
				status: 401,
				body: {
					message: 'Authentication failed'
				}
			});
		}

		settings = await settingsResponse.json();
	} catch (error) {
		console.log('gameResponse::error::', error);
	}
	setHeaders({
		'cache-control': 'max-age=60'
	});

	return json(settings);
}
