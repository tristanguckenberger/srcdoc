<script>
	//@ts-nocheck
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Editor from '$lib/ui/Editor/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import {
		clientWidth,
		isVertical,
		editorContainerHeight,
		editorContainerWidth,
		editorOutContainerWidth,
		editorOutContainerHeight
	} from '$lib/stores/layoutStore';
	import { editorSplit } from '$lib/stores/splitStore';
	// import {
	// 		htmlStore,
	// 		cssStore,
	// 		jsStore,
	// 	} from '$lib/stores/codeStore.js';
	// import { onDestroy, onMount, tick } from 'svelte';
	// import { currentPost, currentPostPageId } from '$lib/stores/postStore';
	// import { postHydrator, projectsHydrator } from '$lib/stores/hydrator';

	const htmlBackup = { source: '', type: 'html' };
	const cssBackup = { source: '', type: 'css' };
	const jsBackup = { source: '', type: 'typescript' };
	let editorWidth = 0;
	let html = '<div></div>';
	let css = 'div { color: red; }';
	let js = 'console.log("hello world")';

	$editorContainerWidth;

	$: editorWidth, editorContainerWidth.set(editorWidth);
</script>

<section id="split-2" bind:clientWidth={editorWidth} bind:clientHeight={$editorContainerHeight}>
	<SplitPane panes={['#split-html', '#split-css', '#split-js']} vertical={!$isVertical}>
		<Pane id={'split-html'} label={'html'}>
			<Editor slot="pane-content" code={htmlBackup} />
		</Pane>
		<Pane id={'split-css'} label={'css'}>
			<Editor slot="pane-content" code={cssBackup} />
		</Pane>
		<Pane id={'split-js'} label={'js'}>
			<Editor slot="pane-content" code={jsBackup} />
		</Pane>
	</SplitPane>
</section>

<style>
	#split-2 {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
