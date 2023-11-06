import { writable } from 'svelte/store';

export const gameControllerStore = writable({
	current: null,
	previous: null,
	pressed: false
});
