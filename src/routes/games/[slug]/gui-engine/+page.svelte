<script>
	// @ts-nocheck
	import { derived } from 'svelte/store';
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import SidePanel from '$lib/ui/gui/SidePanel/index.svelte';

	// Import the new components
	// import LevelEditOutput from '$lib/ui/gui/outputs/LevelEdit.svelte'; // Placeholder for Level Edit Output
	// import LevelDemoOutput from '$lib/ui/gui/outputs/LevelDemo.svelte'; // Placeholder for Level Demo Output
	import Output from '$lib/ui/Output/Output.svelte';

	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isVertical,
		sideBarState,
		appClientWidth
	} from '$lib/stores/layoutStore';
	import {
		guiEditorElement,
		outputsContainerWidth,
		outputsContainerHeight,
		paneManager
	} from '$lib/stores/splitStore';
	import {
		docsOpen,
		areaHeight,
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
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	// Expiremental
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { onDestroy, onMount } from 'svelte';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { gameSession } from '$lib/stores/gameSession/index.js';
	import { modalFullInfoStore, editorPageInfoStore } from '$lib/stores/InfoStore.js';
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';

	let { data } = $props();

	let play = $state(false);
	// let showToolTip = $state(false);
	// let areaHeight = $state(0);
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

	$effect(() => {
		if (data && $baseDataStore === []) {
			baseDataStore.set(data);
		}
	});

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
	.widthText {
		color: white;
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
	button.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
	}
	a.docs-button svg,
	button.docs-button svg {
		width: 23px;
		height: 23px;
		fill: var(--color-primary);
	}
	a.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
		justify-content: center;
	}
	div.action-row {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
	}
	.icon-tooltip-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000000000000;
	}
	.action-row :global(.tooltip__container.bottom) {
		top: 51px !important;
		bottom: unset;
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
