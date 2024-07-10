// @ts-nocheck
import { writable, derived } from 'svelte/store';

export const loginRequestUsername = writable(null);
export const loginRequestPassword = writable(null);

export const loginRequest = derived(
	[loginRequestUsername, loginRequestPassword],
	([$loginRequestUsername, $loginRequestPassword]) => {
		return JSON.stringify({
			email: $loginRequestUsername,
			password: $loginRequestPassword
		});
	}
);

export const registerRequestUsername = writable(null);
export const registerRequestEmail = writable(null);
export const registerRequestPassword = writable(null);
export const registerRequestPasswordConfirm = writable(null);
export const userStore = writable(null); // Stores all users
export const authWidthStore = writable(null);

export const registerRequest = derived(
	[
		registerRequestUsername,
		registerRequestEmail,
		registerRequestPassword,
		registerRequestPasswordConfirm,
		userStore
	],
	([
		$registerRequestUsername,
		$registerRequestEmail,
		$registerRequestPassword,
		$registerRequestPasswordConfirm,
		$userStore
	]) => {
		return JSON.stringify({
			username: $registerRequestUsername,
			usernameAvailable: !$userStore?.find((user) => user.username === $registerRequestUsername),
			email: $registerRequestEmail,
			emailAvailable: !$userStore?.find((user) => user.email === $registerRequestEmail),
			password: $registerRequestPassword,
			passwordIsConfirmed: $registerRequestPasswordConfirm === $registerRequestPassword,
			role: 'user'
		});
	}
);

export const verifactionRequestCode = writable(null);
export const verifactionRequest = derived(verifactionRequestCode, ([$verifactionRequestCode]) => {
	return JSON.stringify({
		verificationCode: $verifactionRequestCode
	});
});
