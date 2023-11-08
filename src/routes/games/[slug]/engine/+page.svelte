<script>
	// @ts-nocheck

	import { default as EditorInput } from '$lib/layout/EditorLayouts/Base/Input.svelte';
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isVertical
	} from '$lib/stores/layoutStore';
	import { editorElement } from '$lib/stores/splitStore';
	import {
		fileSystemSidebarWidth,
		fileSystemSidebarOpen,
		codePanes,
		baseDataStore,
		fileStoreFiles
	} from '$lib/stores/filesStore.js';

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';

	export let data;

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
</script>

<div class="main">
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
			<FileTree files={data?.files} parentFileId={null} gameId={data?.id} userId={data?.userId} />
		</div>
		<div
			id="split-input-output"
			class:fullwidth={!$fileSystemSidebarOpen}
			class:isSideBarOpen
			style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 18 : 0}px;"
		>
			<SplitPane panes={['#split-2', '#split-3']} vertical={value} bind:this={$editorElement}>
				<!-- Editor Content -->
				<EditorInput />

				<!-- Output Content -->
				<section
					id="split-3"
					bind:clientWidth={$editorOutContainerWidth}
					bind:clientHeight={$editorOutContainerHeight}
				>
					<Pane id={'split-output'} label={'output'}>
						<Output slot="pane-content" srcdocBuilt={srcdocBuild} />
					</Pane>
				</section>
			</SplitPane>
		</div>
	</SplitPane>
</div>

<style>
	:global(body) {
		height: 100vh;
		width: 100vw;
		margin: 0;
	}
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		/* overflow-y: hidden; */
	}
	:global(#split-output) {
		height: 100%;
	}
	:global(.monaco-editor) {
		border-radius: 4px;
	}
	:global(.monaco-editor .overflow-guard) {
		border-radius: 4px !important;
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
		height: calc(100vh - 110px);
	}
	#split-input-output.isSideBarOpen {
		max-width: calc(100vw - var(--sidebar-width));
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

	#split-file-explorer.hidden {
		display: none;
	}
	#split-3 {
		height: 100%;
		width: 100%;
	}
</style>
