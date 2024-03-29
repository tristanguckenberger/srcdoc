<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { default as EditorInput } from '$lib/layout/EditorLayouts/Base/Input.svelte';
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
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
		editorElement,
		inputOutputContainerWidth,
		inputOutputContainerHeight,
		paneManager
	} from '$lib/stores/splitStore';
	import {
		fileSystemSidebarWidth,
		fileSystemSidebarOpen,
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

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { onDestroy, onMount } from 'svelte';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { gameSession } from '$lib/stores/gameSession/index.js';

	export let data;
	const play = false;

	$: if (data) {
		// this will be our data's starting point
		// We will need to update this data on every keystroke
		baseDataStore.set(data);
	}

	$: value = $isVertical;

	$: srcdocBuild = (async () =>
		buildDynamicSrcDoc(
			$fileStoreFiles,
			getRootFileId($fileStoreFiles),
			{
				width: $editorOutContainerWidth,
				height: $editorOutContainerHeight
			},
			$gameControllerStore
		))();
	$: isSideBarOpen = $sideBarState;

	$: isFileSystemSideBarOpen = $fileSystemSidebarOpen;

	$: previousRoute = $routeHistoryStore[$routeHistoryStore.length - 2];

	const srcbuild = derived(
		[fileStoreFiles, editorOutContainerWidth, editorOutContainerHeight, gameControllerStore],
		([
			$fileStoreFiles,
			$editorOutContainerWidth,
			$editorOutContainerHeight,
			$gameControllerStore
		]) => {
			return buildDynamicSrcDoc(
				$fileStoreFiles,
				getRootFileId($fileStoreFiles),
				{
					width: $editorOutContainerWidth,
					height: $editorOutContainerHeight
				},
				$gameControllerStore
			);
		}
	);

	onMount(() => {
		// firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
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
		fileSystemSidebarWidth.set(200);
		fileSystemSidebarOpen.set(true);
		codePanes2.set([]);
	});

	// $: console.log('engine::routeHistoryStore::', $routeHistoryStore);
</script>

<svelte:head>
	<meta name="google-adsense-account" content="ca-pub-9366274571597084" />
</svelte:head>

<div class="main" class:isSideBarOpen class:isFileSystemSideBarOpen>
	<SplitPane
		panes={['#split-file-explorer', '#split-input-output']}
		sizes={[20, 80]}
		vertical={false}
		bind:this={$editorElement}
	>
		<div
			id="split-file-explorer"
			class:hidden={!$fileSystemSidebarOpen}
			bind:clientWidth={$fileSystemSidebarWidth}
		>
			<!-- <button on:click={() => console.log('page::', $page)} /> -->
			<a href={previousRoute} class="back">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
					/></svg
				>
				Back
			</a>
			<hr class="sidebar-divider" />
			<FileTree
				files={data?.files}
				parentFileId={null}
				gameId={data?.id}
				userId={data?.userId ?? data?.user_id}
			/>
		</div>
		<div
			bind:clientWidth={$inputOutputContainerWidth}
			bind:clientHeight={$inputOutputContainerHeight}
			id="split-input-output"
			class:fullwidth={!$fileSystemSidebarOpen}
			class:isSideBarOpen
			class:isFileSystemSideBarOpen
			style="--file-system-sidebar-width: {isFileSystemSideBarOpen
				? $fileSystemSidebarWidth + 18
				: 0}px; --sidebar-width: {isSideBarOpen ? 240 : 0}px;"
		>
			<SplitPane
				panes={$openFiles?.length > 0 ? ['#split-2', '#split-3'] : ['#split-3']}
				sizes={$openFiles?.length > 0 ? [50, 50] : [100]}
				vertical={value}
				bind:this={$editorElement}
			>
				<!-- Editor Content -->
				{#if $openFiles?.length > 0}
					<EditorInput />
				{/if}

				<!-- Output Content -->
				<section
					id="split-3"
					class:withoutPanes={$paneManager?.length <= 4}
					bind:clientWidth={$editorOutContainerWidth}
					bind:clientHeight={$editorOutContainerHeight}
				>
					<Pane id={'split-output'} label={'output'}>
						<!-- {#if play} -->
						<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} relaxed />
						<!-- {/if} -->
					</Pane>
				</section>
			</SplitPane>
		</div>
	</SplitPane>
</div>

<style>
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
		/* max-height: calc(100% - 101.5px); */
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
	#split-input-output {
		width: 100%;
		height: 100%;
		height: calc(100% - 4px);
		/* max-height: calc(100% - 101.5px); */
	}
	.main.main.isSideBarOpen #split-input-output {
		height: calc(100% - 4px);
	}
	#split-input-output.isSideBarOpen {
		max-width: calc(100% - var(--sidebar-width));
	}

	#split-input-output.fullwidth {
		width: 100% !important;
	}
	#split-file-explorer {
		padding: 10px;
		border-radius: 6px;
		border: 2px solid #5c5c5c;
		overflow: hidden;
		max-width: 245px;
	}

	@media (min-width: 498px) {
		/* #split-file-explorer {
			height: calc(100% + 16px);
			bottom: 40px;
		} */
		:global(.engineInRoute) #split-file-explorer {
			height: calc(100% + 16px);
			bottom: 40px;
		}
		:global(.engineInRoute.noOpenTabs) #split-file-explorer {
			height: calc(100% - 24px);
			bottom: 0px;
		}
	}

	#split-file-explorer.hidden {
		display: none;
	}
	#split-3 {
		height: 100%;
		width: 100%;
	}

	#split-3.withoutPanes {
		height: 100% !important;
	}

	#split-input-output.isSideBarOpen,
	#split-input-output.isFileSystemSideBarOpen {
		max-width: calc(100% - var(--sidebar-width) + 0px);
		min-width: calc(100% - 275px);
		/* max-width: calc(100% - var(--sidebar-width));
    min-width: calc(100% - var(--sidebar-width) + 40px); */
		max-height: unset !important;
		max-height: calc(100%);
	}
	#split-input-output.isFileSystemSideBarOpen {
		max-width: calc(100% - var(--sidebar-width) + 0px);
		min-width: calc(100% - 275px);
		/* max-width: calc(100% - var(--sidebar-width));
	min-width: calc(100% - var(--sidebar-width) + 40px); */
		max-height: unset !important;
		max-height: calc(100%);
	}
	.sidebar-divider {
		border: unset;
		border-radius: 2px;
		height: 3px;
		background-color: var(--vibrant-blue);
		width: 100%;
	}
	:global(#editor-layout.engineInRoute) .main {
		max-height: calc(100% - 47px);
		margin: 10px !important;
		/* padding-bottom: 66px; */
		max-height: calc(100% - 50px);
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
	a.back {
		display: flex;
		align-items: center;
		gap: 5px;
		color: var(--color-primary);
		text-decoration: none;
		font-family: var(--action-font);
		font-weight: 500;
	}

	a.back svg {
		width: 23px;
		fill: var(--color-primary);
	}
</style>
