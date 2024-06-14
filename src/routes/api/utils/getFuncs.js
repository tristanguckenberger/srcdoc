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
