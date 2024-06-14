/**
 * Retrieves the settings for the current user.
 * @param {Function} fetch - The fetch function used to make HTTP requests.
 * @returns {Promise<Object>} - A promise that resolves to the user's settings.
 */
export const getSettings = async (fetch) => {
	const settingsRes = await fetch(`/api/settings/byUser/get`);
	const settings = await settingsRes.json();
	return settings;
};

/**
 * Retrieves the current user.
 * @param {Function} fetch - The fetch function used to make HTTP requests.
 * @returns {Promise<Object>} - A promise that resolves to the user's settings.
 */
export const getCurrentUser = async (fetch) => {
	const userResponse = await fetch(`/api/users/getCurrentUser`);
	const user = await userResponse.json();
	return user;
};

/**
 * Retrieves the all the users a user is following.
 * @param {Function} fetch - The fetch function used to make HTTP requests.
 * @param {string} userId - The ID of the user to get the 'following' list for.
 * @returns {Promise<Array<Object>>} - A promise that resolves to the user's settings.
 */
export const getFollowing = async (fetch, userId) => {
	const followingResponse = await fetch(`/api/follows/${userId}/following`);
	const following = await followingResponse.json();
	return following;
};

/**
 * Retrieves the all the users following a user.
 * @param {Function} fetch - The fetch function used to make HTTP requests.
 *  * @param {string} userId - The ID of the user to get the 'follower' list for.
 * @returns {Promise<Array<Object>>} - A promise that resolves to the user's settings.
 */
export const getFollowers = async (fetch, userId) => {
	const followersResponse = await fetch(`/api/follows/${userId}/followers`);
	const followers = await followersResponse.json();
	return followers;
};
