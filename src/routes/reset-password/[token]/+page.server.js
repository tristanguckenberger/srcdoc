// @ts-nocheck
import { redirect } from '@sveltejs/kit';
const verifyToken = async (eventFetch, token) => {
	let tokenVerified;
	try {
		const verificationRes = await eventFetch(
			`${process.env.SERVER_URL}/api/auth/forgot-password/${token}`
		);
		tokenVerified = await verificationRes.json();
	} catch (error) {
		console.error('error::', error);
		throw redirect(303, `/`);
	}

	return tokenVerified;
};

export async function load({ params, fetch }) {
	const { token } = params;

	if (!token) {
		throw redirect(303, `/`);
	}

	const didVerify = await verifyToken(fetch, token);

	return {
		didVerify,
		token
	};
}
