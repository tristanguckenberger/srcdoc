import { writable } from 'svelte/store';

export const gameControllerStore = writable({
	current: null,
	previous: null,
	pressed: false
});

export const hidePlayButtonStore = writable(false);
export const lockGameStateStore = writable(false);
export const allowNavigationStore = writable(false);
