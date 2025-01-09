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
	import buildDynamicSrcDoc from '$lib/srcdoc.js';

	// Components
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import SidePanel from '$lib/ui/GUI/Components/SidePanel/index.svelte';
	// import LevelEditOutput from '$lib/ui/gui/outputs/LevelEdit.svelte'; // Placeholder for Level Edit Output
	// import LevelDemoOutput from '$lib/ui/gui/outputs/LevelDemo.svelte'; // Placeholder for Level Demo Output
	import Output from '$lib/ui/Output/Output.svelte';
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';

	let { data } = $props();

	let play = $state(false);
	let isEditMode = $state(true);
	let value = $derived(!$isVertical);
	let isSideBarOpen = $derived($sideBarState);
	let isGuiEditorSidebarOpen = $derived($guiEditorSidebarOpen);
	let previousRoute = $derived($routeHistoryStore[$routeHistoryStore.length - 2]);
	let srcbuild = $derived(
		buildDynamicSrcDoc(
			$fileStoreFiles,
			getRootFileId($fileStoreFiles),
			{
				width: $editorOutContainerWidth,
				height: $editorOutContainerHeight
			},
			$gameControllerStore
		)
	);

	// Base Context Values
	let selectedObject = $state(null);
	let activeScreen = $state(null);
	let didContextSet = $state(false);

	onMount(async () => {
		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (data) {
			baseDataStore.set(data);
		}

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

	$effect(() => {
		if (data && $baseDataStore === []) {
			baseDataStore.set(data);

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
