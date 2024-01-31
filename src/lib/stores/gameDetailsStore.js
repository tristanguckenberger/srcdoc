import { writable, derived } from 'svelte/store';
// import { page } from '$app/stores';

export const gameTitle = writable(null);
export const gameDescription = writable(null);
export const gameIsPublished = writable(null);
export const gameImage = writable(null);

export const gameDetails = derived(
	[gameTitle, gameDescription, gameIsPublished, gameImage],
	([$gameTitle, $gameDescription, $gameIsPublished, $gameImage]) => {
		return JSON.stringify({
			title: $gameTitle,
			description: $gameDescription,
			published: $gameIsPublished,
			image: $gameImage
		});
	}
);
