// @ts-nocheck

// Example API Response: How We Extract Data
export const guiGameData = {
	game: {
		id: 10,
		title: 'New GUI Project',
		description: '',
		published: false
	},
	currentScreen: 5,
	/**
	 * ***** SO WHAT IF INSTEAD OF HAVING SCREENS OVERLAYED ON TOP OF EACH OTHER (UI SCREENS),
	 * WE COMBINE THE CURRENT LVL SCREEN WITH ALL THE UI SCREENS ASSOCIATED WITH IT, INTO ONE SCREEN OBJECT (COMPILED SRCDOC)?
	 *
	 * Recommended screens to be created for a game:
	 * - Default game screen (lvl)
	 * - Default UI screen/Main Menu screen (ui)
	 * - Game HUD screen (ui) // for games with HUD elements or for games that need to display information to the player
	 * - Pause screen (ui)
	 * - Game Over screen (ui)
	 * - Win screen (ui)
	 * - Settings screen (ui)
	 * - Credits screen (ui)
	 * - Loading screen (ui)
	 * - Level Select screen (ui)
	 * - Level Complete screen (ui) // for games with multiple levels, play next, current, or previous levels or go back to level select
	 * - Save/Load screen (ui) // for games with save/load functionality (once api is implemented)
	 *
	 * While the game loads, if available, the Loading screen (ui) is displayed. Otherwise, the default loader for playengine is displayed.
	 *
	 * ***** Behind the scenes, the game engine will create a compiled srcdoc from the screens and files data. Screens passed
	 * to the game engine (srcdoc compiler) will exist in a screenGroup array. The screenGroup array exists in the gui Editor Context that
	 * gets initialized in: routes/games/[slug]/gui-engine/+page.svelte
	 *
	 * ***** NOTE:: The screenGroup array will be required for compilation to work.
	 * ***** NOTE:: A function to Processing the screenGroup array will be the new entry point for
	 * the srcdoc compiler, instead of buildDynamicSrcDoc().
	 *
	 * ***** TODO::(Need to consider where/how I want to build the screenGroup array; leaning towards doing it here over doing it in the
	 * gui context):: Write a function in edit_srcdoc.svelte.ts that (without mutation) filters the available game files and screens
	 * and returns an array of screen ids that are associated with the current/default game lvl screen; screenGroup array
	 *
	 * ***** TODO:: Write an entrypoint function in edit_srcdoc.svelte.ts that processes the screenGroup array combines the screens and files
	 * into a single screen object to be compiled. All associated files are added to the screen object as a files array. ScreenGroup
	 * is updated as the user navigates between screens, removed screens, adds new screens, in-game events occur, UI elements are
	 * clicked, etc.
	 *
	 * * ***** DONT_DO_(YET/AT_ALL):: Add a screenGroup array to the <gui-Editor-Context-Name> that will hold screen ids
	 *
	 */
	screens: [
		{
			game_id: 10,
			id: 5,
			title: 'screen_1',
			description: 'Default game screen',
			data: null, // this will be a JSON object that contains any data needed for the screen like previous state from other screens, etc.
			type: 'lvl',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			game_id: 10,
			id: 6,
			title: 'screen_2',
			description: '2nd game screen',
			data: null, // this will be a JSON object that contains any data needed for the screen like previous state from other screens, etc.
			type: 'lvl',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			// screen with type 'ui' will be used for game ui elements like menu's and HUDS, etc.--available across all screens as overlays
			game_id: 10,
			id: 7,
			title: 'ui_1',
			description: 'Default UI screen',
			data: null, // this will be a JSON object that contains any data needed for the screen like previous state from other screens, etc.
			linkMap: {
				// this will be a JSON object that contains the links between screens and the UI elements that trigger them
				button_1: 5,
				button_2: 7,
				button_3: 8
			},
			type: 'ui',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		}
	],
	files: [
		{
			id: 20,
			screen_id: null, // this is the root folder for the game, it wont ever be associated with a single screen
			game_id: 10,
			name: 'root',
			type: 'folder',
			parent_file_id: null,
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 21,
			screen_id: null, // this will be a universal folder that's needed across a users project
			game_id: 10,
			name: 'presets',
			type: 'folder',
			parent_file_id: 20,
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 22,
			game_id: 10,
			screen_id: 5,
			name: 'screen_1',
			type: 'folder',
			parent_file_id: 20,
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 23,
			screen_id: null, // this will be a universal file that is needed across a users project
			game_id: 10,
			name: 'dynamicObject.js',
			type: 'js',
			parent_file_id: 21,
			content: '// Base code for DynamicObject...',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 24,
			screen_id: null, // this will be a universal file that is needed across a users project
			game_id: 10,
			name: 'staticObject.js',
			type: 'js',
			parent_file_id: 21,
			content: '// Base code for StaticObject...',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 25,
			screen_id: null, // this will be a universal file that is needed across a users project,
			game_id: 10,
			name: 'gameObject.js',
			type: 'js',
			parent_file_id: 21,
			content: '// Base code for GameObject...',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 26,
			screen_id: 5,
			game_id: 10,
			name: 'index.js',
			type: 'js',
			parent_file_id: 22,
			content: '// Base code for index.js…',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 27,
			screen_id: 5,
			game_id: 10,
			name: 'index.html',
			type: 'html',
			parent_file_id: 22,
			content: '<!-- Base code for index.html… --> <h1>Game Title</h1>',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 28,
			screen_id: 5,
			game_id: 10,
			name: 'index.css',
			type: 'css',
			parent_file_id: 22,
			content: '/* Base code for index.css… */ body { color: #fff !important; }',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 29,
			game_id: 10,
			screen_id: 6,
			name: 'screen_2',
			type: 'folder',
			parent_file_id: 20,
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 30,
			screen_id: 6,
			game_id: 10,
			name: 'index.js',
			type: 'js',
			parent_file_id: 29,
			content: '// Base code for index.js…',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 31,
			screen_id: 6,
			game_id: 10,
			name: 'index.html',
			type: 'html',
			parent_file_id: 29,
			content: '<!-- Base code for index.html… --> <h1>Level 2 Title</h1>',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 32,
			screen_id: 6,
			game_id: 10,
			name: 'index.css',
			type: 'css',
			parent_file_id: 29,
			content: '/* Base code for index.css… */ body { color: red !important; }',
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		},
		{
			id: 33,
			screen_id: null,
			game_id: 10,
			name: 'assets',
			type: 'folder',
			parent_file_id: 20,
			created_at: '2021-09-17T18:00:00.000Z',
			updated_at: '2021-09-17T18:00:00.000Z'
		}
	]
};
