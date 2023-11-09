import { userData } from '$lib/mockData/userData.js';

export function load({ params }) {
	const { slug } = params;

	// find the user by slug
	const user = userData.find((user) => user?.id.toString() === slug.toString());

	return {
		...user
	};
}
