<script>
	/**
	 * - /Panels/Screens/index.svelte: This will be an editable list of screens/levels
	 * for a game. Screens can be grouped together for ordered flow (for things like game levels)
	 * or simply for organizational purposes, like showing what is linked. Screens and their
	 * groups/connections and flow could look something like this:
	 * - Screens:
	 *   - Main Menu [UI] [1]
	 *   - Paused Menu Overlay [UI] [Whenever]
	 *   - Levels [LevelGroup] [2]
	 *     - Level 1 [LVL] [2.1]
	 *     - Level 2 [LVL] [2.2]
	 *     - Level 3 [LVL] [2.3]
	 *     - Level 4 [LVL] [2.4]
	 *   - End Credits [UI] [3 or Whenever]
	 *   - Game Over [UI] [2 && Whenever]
	 *
	 * Potential useful variables:
	 * - currentScreen (screen object, derived from context): the currently selected screen
	 * - screens (array): list of screens
	 * - onScreenSelect: callback for when a screen is selected
	 * - onDragStart: callback for when a screen is dragged
	 *
	 *
	 *
	 * Consider:
	 * - Allowing users to preview screen flow visually (e.g., a
	 * flowchart view where users can connect screens).
	 * - Including metadata tags for screens (e.g., “UI,” “Level,”
	 * or custom tags) to make searching easier as projects grow.
	 *
	 */

	/**
	 * screens are the main ui screens/or playable levels of the game
	 * they should be an array of objects called `game_screens` with the following properties:
	 * - id: a unique id for the screen
	 * - title: the title of the screen
	 * - description: a description of the screen
	 * - type: the type of screen (e.g., 'lvl' for a game level, 'ui' for a UI screen)
	 * - position: the position of the screen in the screenGroups array (if it is a level)
	 * - screenGroup: the id of the screen group the screen belongs to
	 * - links: a map of screen ids to the conditions that must be met to navigate to that screen
	 * - logic: the logic for the screen (e.g., the events that should occur when the screen is loaded)
	 * - assets: the assets for the screen (e.g., the images, sounds, etc. that should be loaded)
	 * - screen_data: the data for the screen (e.g., if it's type 'lvl', this would be the player's
	 * health, score, last checkpoint etc.). This data should be stored in a separate object called
	 * `game_data`, to allow for easy saving/loading of the game state between screens.
	 * - updateProjectData(): a function that updates the project data with current the screen
	 * data (e.g., if the player's health changes) (runtime only)
	 * - updateScreenData(): a function that updates the screen data with the current game data (runtime only)
	 * - saveProjectData(): a function that saves the project data to the server (editor only)
	 * - saveScreenData(): a function that saves the screen data to the server (editor only)
	 * - loadProjectData(): a function that loads the project data from the server (editor + runtime)
	 * - loadScreenData(): a function that loads the screen data from the server (editor + runtime)
	 * - deleteScreen(); a function that deletes the screen from the project (editor only)
	 *
	 * We need to type this object
	 */
</script>
