<script>
	// @ts-nocheck
	import { page } from '$app/stores';
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
		baseDataStore
	} from '$lib/stores/filesStore.js';

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { onDestroy, onMount } from 'svelte';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';

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
	$: isSideBarOpen = $fileSystemSidebarOpen;
	$: previousRoute = $routeHistoryStore[$routeHistoryStore.length - 2];
	$: console.log('previousRoute::', $routeHistoryStore);

	onMount(() => {
		// firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}
	});

	onDestroy(() => {
		fileStoreFiles.set(null);
		focusedFileId.set(null);
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
</script>

<div class="main" class:isSideBarOpen>
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
			<a href={previousRoute}>Back</a>
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
			style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 18 : 0}px;"
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
						<Output slot="pane-content" srcdocBuilt={srcdocBuild} {play} />
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
	#split-input-output.isSideBarOpen {
		max-width: calc(100% - var(--sidebar-width));
	}

	#split-input-output.fullwidth {
		width: 100% !important;
	}
	#split-file-explorer {
		padding: 10px;
		border-radius: 8px;
		border: 2px solid #5c5c5c;
		overflow: hidden;
		max-width: 245px;
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

	#split-input-output.isSideBarOpen {
		max-width: calc(100% - var(--sidebar-width) + 4px);
		min-width: calc(100% - 275px);
		max-height: unset !important;
	}
	.sidebar-divider {
		border: 1px solid #f6f6f605;
		border-radius: 25px;
		width: 90%;
	}
	:global(#editor-layout.engineInRoute) .main.isSideBarOpen {
		max-height: unset;
	}
</style>
