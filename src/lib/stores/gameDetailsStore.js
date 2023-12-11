import { writable, derived } from 'svelte/store';
// import { page } from '$app/stores';

export const gameTitle = writable(null);
export const gameDescription = writable(null);
export const gameImage = writable(null);

export const gameDetails = derived(
	[gameTitle, gameDescription, gameImage],
	([$gameTitle, $gameDescription, $gameImage]) => {
		return JSON.stringify({
			title: $gameTitle,
			description: $gameDescription,
			image: $gameImage
		});
	}
);
