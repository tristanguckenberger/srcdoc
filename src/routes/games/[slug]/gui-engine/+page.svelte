<script>
	// @ts-nocheck
	// Svelte Imports
	import { derived } from 'svelte/store';
	import { browser } from '$app/environment';
	import { onDestroy, onMount, tick, getContext, setContext } from 'svelte';

	// Stores
	import {
		guiEditorSidebarWidth,
		guiEditorSidebarOpen,
		fileStoreFiles,
		focusedFileId,
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		previouslyFocusedFileId,
		softSelectedFileId,
		openFiles,
		codePanes2,
		baseDataStore,
		focusedFolderId
	} from '$lib/stores/filesStore.js';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isVertical,
		sideBarState,
		appClientWidth
	} from '$lib/stores/layoutStore';
	import { guiEditorElement } from '$lib/stores/splitStore';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { gameSession } from '$lib/stores/gameSession/index.js';
	import { modalFullInfoStore, editorPageInfoStore } from '$lib/stores/InfoStore.js';
	import { getRootFileId } from '$lib/utils/getter.js';

	// Utils
	// import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import {
		buildDynamicSrcDoc,
		getBaseFiles,
		generateClassFileFromJSON
	} from '$lib/utils/gui/compilation/edit_srcdoc.svelte.ts';

	// Components
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import SidePanel from '$lib/ui/GUI/Components/SidePanel/index.svelte';
	import Output from '$lib/ui/GUI/Components/Output/LevelEditOutput/index.svelte'; // Placeholder for Level Edit Output
	// import LevelDemoOutput from '$lib/ui/gui/outputs/LevelDemo.svelte'; // Placeholder for Level Demo Output
	// import Output from '$lib/ui/Output/Output.svelte';
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';
	import { currentGame } from '$lib/stores/gamesStore.js';
	import { guiGameData } from '$lib/mockData/guiGameData';

	let { data } = $props();

	onMount(async () => {
		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (guiGameData) {
			baseDataStore.set(guiGameData);
		}
		console.log('data::', data);
		if (browser) {
			// await tick();
			setTimeout(() => {
				if (!$editorPageInfoStore?.viewed) {
					$modalFullInfoStore = $editorPageInfoStore?.info;
				}
			}, 500);
		}
	});

	onDestroy(() => {
		fileStoreFiles.set(null);
		focusedFileId.set(null);
		focusedFolderId.set(null);
		fileSystemExpanderStore.set({});
		fileSystemMetaDataStore.set({
			gameId: null,
			userId: null
		});
		previouslyFocusedFileId.set(null);
		softSelectedFileId.set(null);
		openFiles.set([]);
		guiEditorSidebarWidth.set(200);
		guiEditorSidebarOpen.set(true);
		codePanes2.set([]);
		baseDataStore.set([]);
	});

	let play = $state(false);
	let isEditMode = $state(true);
	let projectId = $state(data?.id);
	let projectUserId = $state(data?.user_id);
	let projectTitle = $state(data?.title);
	let projectDescription = $state(data?.description);
	let projectPublished = $state(data?.published);
	let projectCreatedAt = $state(data?.created_at);
	let projectUpdatedAt = $state(data?.updated_at);
	let projectThumbnail = $state(data?.thumbnail);
	let files = $state(data?.files);
	let panelTitle = $state('');
	let draggingOver = $state(false);
	let draggingOverGameId = $state(null);
	let value = $derived(!$isVertical);
	let isSideBarOpen = $derived($sideBarState);
	let didContextSet = $state(false);
	let isGuiEditorSidebarOpen = $derived($guiEditorSidebarOpen);
	let previousRoute = $derived($routeHistoryStore[$routeHistoryStore.length - 2]);
	let srcbuild = $derived(
		buildDynamicSrcDoc(guiGameData, 1, $fileStoreFiles, getRootFileId($fileStoreFiles), {
			width: $editorOutContainerWidth,
			height: $editorOutContainerHeight
		})
	);
	/**
	 * 
	 * USE THESE AS A REFERENCE FOR REORDERING SCREENS
	 * 
	 * 
	 * 
	function dragStart(e, game) {
		e.dataTransfer.effectAllowed = 'all';
		draggedItem = game;
	}

	function dragOver(e, game) {
		e.preventDefault();
		$draggingOver = true;
		$draggingOverGameId = game.id;

		const targetElement = document.getElementById(`game_${game.id}`);
		const targetRect = targetElement.getBoundingClientRect();
		const relativeY = e.clientY - targetRect.top;
		const percentage = (relativeY / targetRect.height) * 100;
		gradientPosition = Math.min(Math.max(100 - percentage, 0), 100);
	}

	function dragEnd() {
		draggedItem = null;
		$draggingOver = false;
		$draggingOverGameId = null;
	}
	async function drop(e, game) {
		e.preventDefault();
		if (draggedItem === null) return;

		await tick();

		const draggedIndex = games.findIndex((f) => f.id === draggedItem.id);
		const targetIndex = games.findIndex((f) => f.id === game.id);

		if (draggedIndex === targetIndex) return;
		// Determine the drop position relative to the target element's bounds
		const targetElement = document.getElementById(`game_${game.id}`);
		const targetRect = targetElement.getBoundingClientRect();
		const dropPositionY = e.clientY - targetRect.top;
		const newGames = [...games];
		const [removedItem] = newGames.splice(draggedIndex, 1);

		if (
			e.clientY - e.target.getBoundingClientRect().top < e.target.offsetHeight / 2 ||
			dropPositionY < targetRect.height / 2
		) {
			if (draggedIndex > targetIndex) {
				// When the dragged item originally was after the target item
				newGames.splice(targetIndex, 0, removedItem);
			} else {
				// When the dragged item originally was before the target item
				newGames.splice(targetIndex, 0, removedItem);
			}
		} else {
			// If drop is in the lower half
			if (draggedIndex > targetIndex) {
				// When the dragged item originally was after the target item
				newGames.splice(targetIndex + 1, 0, removedItem);
			} else {
				// When the dragged item originally was before the target item
				// Adjusting because the target index effectively shifts due to the removal
				newGames.splice(targetIndex, 0, removedItem);
			}
		}

		// games = newGames.sort((a, b) => a.item_order - b.item_order); // Re-sort games based on item_order after update

		games = newGames;
		// Update the games order after reordering
		const newOrder = games.map((game) => game.id);
		gamesOrder.set(newOrder);

		$draggingOver = false;
		$draggingOverGameId = null;

		// Fetch Playlist API to update the item_order
		await tick();
		await handleUpdatePlaylistOrder(newOrder);
	}
	*/

	let projectVersions = $state([]);
	let projectVersioning = {
		versions: projectVersions,
		getVersion: () => {},
		setVersion: () => {}
	};

	let projectInfo = {
		id: projectId,
		userId: projectUserId,
		title: projectTitle,
		description: projectDescription,
		published: projectPublished,
		createdAt: projectCreatedAt,
		updatedAt: projectUpdatedAt,
		thumbnail: projectThumbnail,
		versioning: projectVersioning
	};

	let projectSettings = {};
	let projectAssets = $state([]);
	let projectGlobalAssetManager = {
		assets: projectAssets,
		addAsset: () => {},
		removeAsset: () => {},
		sortBy: () => {},
		findAsset: () => {}
	};
	let projectObjects = $state([]);
	let projectGlobalObjectManager = {
		objects: projectObjects,
		addObject: () => {},
		removeObject: () => {}
	};
	let projectEditorIframeUtils = {
		undo: () => {},
		redo: () => {},
		save: () => {},
		saveAs: () => {},
		export: () => {},
		import: () => {},
		addObject: () => {},
		removeObject: () => {}
	};
	let globalObjects = $state([]);
	let globalAssets = $state([]);
	let globalLogic = $state({
		startGame: () => {},
		endGame: () => {},
		pauseGame: () => {},
		resumeGame: () => {}
	});

	let gameData = {
		globalObjects,
		globalAssets,
		globalLogic
	};

	let screens = $state([]);
	let currentScreen = $state(screens[0]);
	let isRuntimeMode = $derived(!isEditMode);

	// Screen Groups Manager
	let screenGroups = $state([]);
	let currentScreenGroup = $state(null);
	let screenGroupManager = {
		screenGroups,
		currentScreenGroup: () => currentScreenGroup,
		setCurrentScreenGroup: () => {},
		handleScreenGroupSelect: () => {},
		handleScreenGroupDragStart: () => {}
	};

	// Editor Manager
	let selectedObject = $state(null);
	let editorManager = {
		handleRightClick: () => {},
		handleObjectSelect: () => {},
		undo: () => {},
		redo: () => {},
		save: () => {},
		saveAs: () => {},
		export: () => {},
		import: () => {},
		addObject: () => {},
		removeObject: () => {},
		selectedObject: () => selectedObject
	};

	let guiEditorProjectState = {
		project: {
			projectInfo,
			projectSettings,
			projectGlobalAssetManager,
			gameData,
			screensManager: {
				screens,
				currentScreen: () => currentScreen,
				isEditMode: () => isEditMode,
				isRuntimeMode: () => isRuntimeMode,
				setCurrentScreen: (index) => {
					currentScreen = screens[index];
				},
				handleScreenSelect: (e) => {
					const index = screens.findIndex((screen) => screen.id === e?.detail?.screen?.id);
					setCurrentScreen(index);
				},
				handleScreenDragStart: (e, screen) => {
					e.dataTransfer.effectAllowed = 'all';
					draggedItem = game;
				},
				handleScreenDragStop: (e) => {
					handleScreenPositionChange();
				},
				handleDragDrop: async (e, screen) => {
					e.preventDefault();
					if (draggedItem === null) return;

					await tick();

					const draggedIndex = games.findIndex((f) => f.id === draggedItem.id);
					const targetIndex = games.findIndex((f) => f.id === game.id);

					if (draggedIndex === targetIndex) return;
					// Determine the drop position relative to the target element's bounds
					const targetElement = document.getElementById(`game_${game.id}`);
					const targetRect = targetElement.getBoundingClientRect();
					const dropPositionY = e.clientY - targetRect.top;
					const newGames = [...games];
					const [removedItem] = newGames.splice(draggedIndex, 1);

					if (
						e.clientY - e.target.getBoundingClientRect().top < e.target.offsetHeight / 2 ||
						dropPositionY < targetRect.height / 2
					) {
						if (draggedIndex > targetIndex) {
							// When the dragged item originally was after the target item
							newGames.splice(targetIndex, 0, removedItem);
						} else {
							// When the dragged item originally was before the target item
							newGames.splice(targetIndex, 0, removedItem);
						}
					} else {
						// If drop is in the lower half
						if (draggedIndex > targetIndex) {
							// When the dragged item originally was after the target item
							newGames.splice(targetIndex + 1, 0, removedItem);
						} else {
							// When the dragged item originally was before the target item
							// Adjusting because the target index effectively shifts due to the removal
							newGames.splice(targetIndex, 0, removedItem);
						}
					}

					// games = newGames.sort((a, b) => a.item_order - b.item_order); // Re-sort games based on item_order after update

					games = newGames;
					// Update the games order after reordering
					const newOrder = games.map((game) => game.id);
					gamesOrder.set(newOrder);

					$draggingOver = false;
					$draggingOverGameId = null;

					// Fetch Playlist API to update the item_order
					await tick();
					await handleUpdatePlaylistOrder(newOrder);
				},
				handleScreenPositionChange: () => {},
				toggleEditMode: () => {}
			},
			/**
			 * screen groups are collections of screens that are linked together,
			 * typically for game levels or routing.
			 *
			 * Game levels are denoted by a screen with a type of 'lvl'
			 * - levels are ordered by their position in the screenGroups
			 * array. The first level is the first screen in the first
			 * screenGroup, etc.
			 *
			 * UI screens are denoted by a screen with a type of 'ui':
			 * - UI screens are typically used for menus, settings, etc.
			 * - UI screens are not ordered by their position in the
			 * screenGroups, but can be linked to other UI screens.
			 */
			screenGroupManager,
			editorManager,
			files,
			focusedFileId: $focusedFileId,
			srcbuild: () => srcbuild,
			previousRoute: () => previousRoute,
			play: () => play,
			openFiles: () => openFiles
		}
	};

	setContext('GUIContext', guiEditorProjectState);

	$effect(() => {
		if (data && !$baseDataStore) {
			// baseDataStore.set(data); // Uncomment this line when srcdoc can be built from data
			baseDataStore.set({ ...guiGameData?.game, files: guiGameData?.files }); // Comment this line when srcdoc can be built from data

			// Set context once, and only after data loads
			if (!didContextSet) {
				setContext('GUIContext', {
					selectedObject,
					activeScreen
				});

				didContextSet = true;
			}
		}
	});
</script>

<div
	class="main"
	class:isSideBarOpen
	class:isGuiEditorSidebarOpen
	style="--sidebar-width: {isSideBarOpen ? 240 : 0}px;"
>
	<SplitPane
		panes={['#split-file-explorer', '#split-input-output']}
		sizes={[50, 50]}
		vertical={false}
		bind:this={$guiEditorElement}
		splitParent={'split-main'}
	>
		{#snippet sidebar()}
			<Pane id={'split-file-explorer'}>
				{#snippet paneContent()}
					<SidePanel />
				{/snippet}
			</Pane>
		{/snippet}

		{#snippet content()}
			<Pane id={'split-input-output'} label={'output'}>
				{#snippet paneContent()}
					<!-- {#if isEditMode}
                        <LevelEditOutput srcdocBuilt={srcbuild} {play} relaxed />
                    {:else}
                        <LevelDemoOutput srcdocBuilt={srcbuild} {play} relaxed />
                    {/if} -->
					<Output relaxed />
				{/snippet}
			</Pane>
		{/snippet}
	</SplitPane>
</div>

<style>
	div.main :global(#split-file-explorer) {
		display: none;
	}
	div.main.isGuiEditorSidebarOpen :global(#split-file-explorer) {
		display: block;
	}
	:global(body) {
		height: 100%;
		width: 100%;
		margin: 0;
	}
	.main {
		margin: 0 10px 10px 10px;
		max-height: unset;
		max-height: calc(100% - 106.5px);
	}
	:global(#split-output) {
		height: 100%;
	}
	:global(.monaco-editor) {
		border-radius: 4px;
	}
	:global(.monaco-editor .overflow-guard) {
		border-radius: 6px !important;
	}
	:global(.margin-view-overlays) {
		background-color: transparent;
	}
	:global(.view-lines) {
		background-color: transparent;
	}
	:global(.section-panel) {
		flex-grow: 1;
	}

	.main.main.isSideBarOpen :global(#split-outputs) {
		height: calc(100% - 4px);
	}

	:global(#editor-layout.engineInRoute) .main.isSideBarOpen {
		max-height: unset;
		padding-bottom: unset;
		max-height: calc(100% - 50px);
	}

	:global(#editor-layout.engineInRoute) {
		height: calc(100% - 56.5px);
		padding-top: 10px;
		max-height: calc(100% - 56.5px);
	}

	:global(#editor-layout.engineInRoute.showSideBar) {
		padding-top: 0px;
	}

	:global(main.editor) {
		height: calc(100% - 56.5px) !important;
	}
	:global(.engineInRoute #split-file-explorer) {
		/* height: calc(100%); */
		/* bottom: 40px; */
		/* max-width: 45%; */
		overflow: hidden;
	}
	:global(div.main.isSideBarOpen #split-input-output) {
		max-width: calc(100% - 254px + 10px);
		/* min-width: calc(100% - 275px); */
		/* max-width: calc(100% - var(--sidebar-width));
    min-width: calc(100% - var(--sidebar-width) + 40px); */
		max-height: unset !important;
		max-height: calc(100%);
	}
</style>
