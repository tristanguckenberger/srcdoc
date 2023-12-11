import { writable, derived } from 'svelte/store';
import { page } from '$app/stores';

export const gameTitle = writable(null);
export const gameDescription = writable(null);
export const gameImage = writable(null);

export const gameDetails = derived(
	[gameTitle, gameDescription, gameImage, page],
	([$gameTitle, $gameDescription, $gameImage, $page]) => {
		console.log('page from game details store::', $page);
		return JSON.stringify({
			title: $gameTitle,
			description: $gameDescription,
			image: $gameImage
		});
	}
);
