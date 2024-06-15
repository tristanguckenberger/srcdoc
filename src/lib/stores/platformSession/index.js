import { writable } from 'svelte/store';

export const platformSession = writable({
	currentUser: null,
	settings: null,
	ready: false
});
