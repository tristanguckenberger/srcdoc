<!-- @migration-task Error while migrating Svelte code: can't migrate `$: value = !$isVertical;` to `$derived` because there's a variable named derived.
     Rename the variable and try again or migrate by hand. -->
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
		paneManager,
		splitInstanceStore,
		splitStore
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
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { onDestroy, onMount } from 'svelte';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { gameSession } from '$lib/stores/gameSession/index.js';
	import { modalFullInfoStore, editorPageInfoStore } from '$lib/stores/InfoStore.js';
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';

	let { data } = $props();

	const play = $state(false);
	let docsOpen = $state(false);
	let showToolTip = $state(false);

	// $: if (data) {
	// 	baseDataStore.set(data);
	// }

	let value = $derived(!$isVertical);

	let isSideBarOpen = $derived($sideBarState);

	let isFileSystemSideBarOpen = $derived($fileSystemSidebarOpen);

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

	onMount(async () => {
		if (data) {
			baseDataStore.set(data);
		}
		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		// if (browser) {
		// 	await tick();
		// 	setTimeout(() => {
		// 		if (!$editorPageInfoStore?.viewed) {
		// 			$modalFullInfoStore = $editorPageInfoStore?.info;
		// 		}
		// 	}, 500);
		// }
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

	// bind for fileExplorer pane height
	let areaHeight = $state(0);
</script>

<div
	id="split-main"
	class="main"
	class:isSideBarOpen
	class:isFileSystemSideBarOpen
	class:hiddenSidebar={!isFileSystemSideBarOpen}
>
	<SplitPane
		panes={['#split-file-explorer', '#split-input-output']}
		sizes={[50, 50]}
		vertical={false}
		bind:this={$editorElement}
		splitParent={'split-main'}
	>
		{#snippet sidebar()}
			<Pane id={'split-file-explorer'}>
				{#snippet paneContent()}
					<div
						class="sidebar"
						class:hidden={!$fileSystemSidebarOpen}
						class:docsOpen
						bind:clientWidth={$fileSystemSidebarWidth}
						bind:clientHeight={areaHeight}
					>
						<div class="action-row">
							<a href={previousRoute} class="docs-button" aria-label="backbtn">
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
							</a>
							<button
								aria-label="docs"
								class="docs-button"
								onclick={() => {
									// fileSystemSidebarOpen.set(false);
									docsOpen = !docsOpen;
									showToolTip = false;
								}}
							>
								<div
									role="tooltip"
									class="icon-tooltip-container"
									onmouseover={() => {
										showToolTip = true;
									}}
									onmouseleave={() => {
										showToolTip = false;
									}}
									onfocus={() => {}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										fill="#000000"
										viewBox="0 0 256 256"
										><path
											d="M213.66,66.34l-40-40A8,8,0,0,0,168,24H88A16,16,0,0,0,72,40V56H56A16,16,0,0,0,40,72V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V200h16a16,16,0,0,0,16-16V72A8,8,0,0,0,213.66,66.34ZM168,216H56V72h76.69L168,107.31v84.53c0,.06,0,.11,0,.16s0,.1,0,.16V216Zm32-32H184V104a8,8,0,0,0-2.34-5.66l-40-40A8,8,0,0,0,136,56H88V40h76.69L200,75.31Zm-56-32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,152Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,184Z"
										/></svg
									>
								</div></button
							>
							{#if showToolTip}
								<ToolTip text="Open/Close Editor Docs" position="bottom" />
							{/if}
						</div>

						<hr class="sidebar-divider" />
						{#if !docsOpen}
							<FileTree
								files={data?.files}
								parentFileId={null}
								gameId={data?.id}
								userId={data?.userId ?? data?.user_id}
							/>
						{:else}
							<Documentation parentHeight={areaHeight} />
						{/if}
					</div>
				{/snippet}
			</Pane>
		{/snippet}
		{#snippet content()}
			<Pane id={'split-input-output'}>
				{#snippet paneContent()}
					<div
						bind:clientWidth={$inputOutputContainerWidth}
						bind:clientHeight={$inputOutputContainerHeight}
						class:fullwidth={!$fileSystemSidebarOpen}
						class:isSideBarOpen
						class:isFileSystemSideBarOpen
						class:docsOpen
						style="--file-system-sidebar-width: {isFileSystemSideBarOpen
							? $fileSystemSidebarWidth + 18
							: 0}px; --sidebar-width: {isSideBarOpen ? 240 : 0}px; height: 100%; width: 100%;"
					>
						<SplitPane
							panes={$openFiles?.length > 0 ? ['#split-2', '#split-3'] : ['#split-3']}
							sizes={$openFiles?.length > 0 ? [50, 50] : [100]}
							vertical={value}
							splitParent={'split-input-output'}
							bind:this={$editorElement}
						>
							<!-- {#snippet editor($openFiles)} -->
							<!-- Editor Content -->
							<!-- {#if $openFiles?.length > 0} -->
							<EditorInput />
							<!-- {/if} -->
							<!-- {/snippet} -->

							<!-- {#snippet output()} -->
							<!-- Output Content -->

							<section
								id="split-3"
								class={{ withoutPanes: $openFiles?.length === 0 }}
								bind:clientWidth={$editorOutContainerWidth}
								bind:clientHeight={$editorOutContainerHeight}
							>
								<Pane id={'split-output'} label={'output'}>
									{#snippet paneContent()}
										<Output relaxed />
									{/snippet}
								</Pane>
							</section>
							<!-- {/snippet} -->
						</SplitPane>
					</div>
				{/snippet}
			</Pane>
		{/snippet}
	</SplitPane>
</div>

<style>
	:global(body) {
		height: 100%;
		width: 100%;
		margin: 0;
	}
	.main {
		margin: 0 10px 0 10px;
		max-height: unset;
		max-height: calc(100% - 106.5px);
	}
	:global(#split-output) {
		height: calc(100% - 4px);
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

	#split-file-explorer.docsOpen {
		max-width: 50% !important;
	}

	@media (min-width: 498px) {
		/* #split-file-explorer {
			height: calc(100% + 16px);
			bottom: 40px;
		} */
		:global(.engineInRoute) #split-file-explorer {
			height: calc(100% + 16px);
			bottom: 40px;
			/* max-width: 200px; */
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

	:global(#split-input-output div.isSideBarOpen) {
		max-width: calc(100% - var(--sidebar-width) + 10px);
		/* min-width: calc(100% - 275px); */
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
	#split-input-output.isFileSystemSideBarOpen.docsOpen {
		max-width: calc(100%);
		min-width: calc(100% - 50%);
		/* max-width: calc(100% - var(--sidebar-width));
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
		height: calc(100% - 66.5px);
		padding-top: 10px;
		max-height: calc(100% - 66.5px);
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
	:global(div.layout-container.engineInRoute) {
		/* position: relative; */
	}

	#split-main.hiddenSidebar .split-main :global(div.split.split-main .gutter:first-child) {
		display: none !important;
	}
	.sidebar {
		padding: 10px;
	}
</style>
