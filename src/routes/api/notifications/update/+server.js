// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
	const token = cookies.get('token') ?? localStorage?.getItem('token');

	const userReqHeaders = new Headers();
	userReqHeaders.append('Content-Type', 'application/json');
	userReqHeaders.append('Authorization', `Bearer ${token}`);

	const data = await request.json();
	const userReqInit = {
		method: 'PUT',
		headers: userReqHeaders,
		body: JSON.stringify(data)
	};

	const notificationUpdateResponse = await fetch(
		`${process.env.SERVER_URL}/api/notifications/update`,
		userReqInit
	);

	if (!notificationUpdateResponse.ok) {
		return json([]);
	}

	const notifications = await notificationUpdateResponse.json();

	return json(notifications);
}
