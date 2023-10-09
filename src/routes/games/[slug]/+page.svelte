<script>
	// @ts-nocheck

	import { default as EditorInput } from '$lib/layout/EditorLayouts/Base/Input.svelte';
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import Output from '$lib/ui/Output/index.svelte';
	import buildDoc from '$lib/srcdoc';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isVertical
	} from '$lib/stores/layoutStore';
	import { htmlStore, cssStore, jsStore } from '$lib/stores/codeStore.js';
	import { editorElement } from '$lib/stores/splitStore';

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';

	export let data;

	$: console.log(data);

	// $: srcdoc = {
	// 	html: $htmlStore,
	// 	css: $cssStore,
	// 	js: $jsStore
	// };
	// $: value = $isVertical;
	// $: srcdocBuild = buildDoc(srcdoc?.html?.source, srcdoc?.css?.source, srcdoc?.js?.source);
</script>

<div class="main">
	<!-- <SplitPane panes={['#split-2', '#split-3']} vertical={value} bind:this={$editorElement}>
		<!-- Editor Content -->
	<!-- <EditorInput /> -->

	<!-- Output Content -->
	<!-- <section
			id="split-3"
			bind:clientWidth={$editorOutContainerWidth}
			bind:clientHeight={$editorOutContainerHeight}
		>
			<Pane id={'split-output'} label={'output'}>
				<Output slot="pane-content" srcdocBuilt={srcdocBuild} />
			</Pane>
		</section>
	</SplitPane>  -->

	<TabContainer />
	<FileTree files={data?.files} parentFileId={null} gameId={data?.id} userId={data?.userId} />
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
		border-radius: 6px;
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
</style>
