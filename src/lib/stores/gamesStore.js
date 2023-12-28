import { writable } from 'svelte/store';

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
export const currentGame = writable(null);
export const src_build = writable(null);

// export const availableGames = derived([baseDataStore, openFiles], ([$baseDataStore]) => {
// 	return openFiles.map((file) => {
// 		const baseFile = $baseDataStore.find((baseFile) => baseFile.id === file.id);

// 		if (baseFile?.content !== file.content) {
// 			openFiles.update((files) => {
// 				const update = {
// 					...file,
// 					canSave: true
// 				};
// 				return files.map((file) => (file.id === update.id ? update : file));
// 			});
// 		} else {
// 			openFiles.update((files) => {
// 				const update = {
// 					...file,
// 					canSave: false
// 				};
// 				return files.map((file) => (file.id === update.id ? update : file));
// 			});
// 		}

// 		const update = {
// 			id: file.id,
// 			name: file.name,
// 			type: file.type,
// 			content: file.content,
// 			parentFileId: file?.parentFileId ?? file?.parent_file_id,
// 			gameId: file.gameId ?? file.game_id
// 		};
// 		return update;
// 	});
// });

// export const lastUpdated = writable(null);
