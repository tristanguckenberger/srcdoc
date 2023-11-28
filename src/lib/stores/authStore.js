import { writable, derived } from 'svelte/store';

export const loginRequestUsername = writable(null);
export const loginRequestPassword = writable(null);

export const loginRequest = derived(
	[loginRequestUsername, loginRequestPassword],
	([$loginRequestUsername, $loginRequestPassword]) => {
		return JSON.stringify({
			username: $loginRequestUsername,
			password: $loginRequestPassword
		});
	}
);
