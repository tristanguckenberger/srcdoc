import { json } from '@sveltejs/kit';

export async function POST({ setHeaders, cookies, params }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	const { id } = params;

	const token = cookies.get('token');
	if (!token) {
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}
	const favReqHeaders = new Headers();
	favReqHeaders?.append('Authorization', `Bearer ${token}`);
	const favReqInit = {
		method: 'DELETE',
		headers: favReqHeaders
	};

	const favResponse = await fetch(
		`${process.env.SERVER_URL}/api/favorites/delete/${id}`,
		favReqInit
	);
	if (!favResponse.ok) {
		cookies.delete('token', { path: '/' });
		return json({
			status: 401,
			body: {
				message: 'Authentication failed'
			}
		});
	}

	const favorite = await favResponse.json();

	return json(favorite);
}
