<script>
	// @ts-nocheck
	import { onDestroy } from 'svelte';
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

	export let data;

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

<div class="game-info-container">
	<div class="game-info">
		<div class="game-header-image-container">
			<img
				class="game-header-image"
				src={data?.game?.headerImage ?? 'https://picsum.photos/300/800'}
			/>
		</div>
		<div class="game-details">
			<h1>{data?.title}</h1>
			<p>{data?.description}</p>
			<!-- <div class="game-tags">
				{#each data?.game?.tags as tag}
					<span>{tag}</span>
				{/each}
			</div> -->
			<div class="game-controls">
				<a href={`/games/${data?.id}/play`}>Play</a>
				<a href={`/games/${data?.id}/engine`}>Open in Engine</a>
			</div>
		</div>
	</div>
</div>

<style>
	.game-info-container {
		height: 100%;
		width: 100%;
		display: flex;
	}
	.game-info {
		height: 100%;
		width: 80%;
		display: flex;
		flex-direction: column;
		min-width: 250px;
	}
	.game-header-image-container {
		height: 100%;
		width: 100%;
	}
</style>
