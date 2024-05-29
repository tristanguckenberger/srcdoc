<script>
	//@ts-nocheck
	import Output from '$lib/ui/Output/Output.svelte';
	import MockSlider from '$lib/ui/MockSlider/index.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import { src_build, playButton } from '$lib/stores/gamesStore.js';
	import { derived } from 'svelte/store';
	import { editorOutContainerWidth, editorOutContainerHeight } from '$lib/stores/layoutStore';
	import { fileStoreFiles } from '$lib/stores/filesStore.js';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { gameSession, gameSessionState } from '$lib/stores/gameSession/index.js';
	import { onMount } from 'svelte';
	import { actionMenuOpen, gameFavorites } from '$lib/stores/gamesStore.js';

	let play = false;

	onMount(() => {
		$playButton = false;
	});

	$: play = $playButton;
	$: src_build.set($srcbuild);

	const srcbuild = derived(
		[
			fileStoreFiles,
			editorOutContainerWidth,
			editorOutContainerHeight,
			gameControllerStore,
			gameSession
		],
		([
			$fileStoreFiles,
			$editorOutContainerWidth,
			$editorOutContainerHeight,
			$gameControllerStore,
			$gameSession
		]) => {
			if (!$gameSession?.currentGame) return '';
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
</script>

<!-- <div class="output-play-action-overlay"> -->
{#if play}
	<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} relaxed />
{:else}
	<MockSlider />
{/if}
<!-- </div> -->
