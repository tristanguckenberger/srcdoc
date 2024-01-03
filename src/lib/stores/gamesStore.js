import { writable, derived } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';

/**
 * With this file I eventually want to move towards a time-checked-hydration model (this probably has a name)
 *
 * Essentially we'll have a base writable store that gets set based on games from either:
 * - A user's "My Projects" page
 * - Play Engine Home page
 * - Algorithmic routes like "Top Rated", "For You", "Newest", etc.
 * - Categoric routes like "2D", "3D", "RPG", "Platformer", "Racing", "Puzzel"
 * - Game Type routes like "Byte (Arcade style games; short form content,
 * available to both mobile and desktop)", Mobile (games made for mobile
 * devices with touch capabilities and such), Desktop (games made for a desktop computer),
 * Universal (games that can be played across all platforms)
 *
 * These games will essentially all take the same object shape and will
 * be available within an array, so no additional or special data/object
 * formatting will be required here.
 *
 * We will need to take note of all the locations we want to update our games store,
 * so that when a user lands on each listed route, within it's +page.svelte's onMount func
 * we'll want to set the gamesData store so that the games available to swipe to from
 * a single games play page, match the previous route used to navigate OR DEFAULT TO the
 * base gamesAvailable for ALL PUBLISHED GAMES
 *
 */
export const gamesData = writable([]);

export const topGame = writable(null);
export const currentGame = writable(null);
export const bottomGame = writable(null);
export const resetProgress = writable(false);
export const progressState = writable(null);
export const progressResetCheck = writable(false);

export const gameCarousel = derived(
	[currentGame, topGame, bottomGame],
	([$currentGame, $topGame, $bottomGame]) => {
		return [$topGame, $currentGame, $bottomGame];
	}
);

export const src_build = writable(null);
export const playButton = writable(false);
export const actionMenuOpen = writable(false);

export const progress = tweened(0, {
	duration: 0,
	easing: linear
});

// This is the distance the slide will travel when the user swipes
// top or bottom, it's specific to the game carousel
