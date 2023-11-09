<script>
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
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
		firstRun
	} from '$lib/stores/filesStore.js';
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import Button from '$lib/ui/Button/index.svelte';

	export let data;

	onMount(() => {
		firstRun.set(true);
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
	$: themeString = $themeDataStore?.theme?.join(' ');
	let imageLoaded = false;
</script>

<div class="game-info-container" style={`${themeString}`}>
	<div class="game-info">
		<div class="game-header-image-container">
			<img
				class="game-header-image"
				class:showImage={imageLoaded}
				src={data?.headerImage ?? 'https://picsum.photos/2000/300'}
				on:load={() => {
					imageLoaded = true;
				}}
			/>
			<div class="game-header-placeholder" class:hidePlaceholder={imageLoaded} />
		</div>
		<div class="game-details">
			<div class="game-controls">
				<h1>{data?.title}</h1>
				<div class="main-action-container">
					<Button link={`/games/${data?.id}/engine`} label={'Open in Engine'} />
					<Button link={`/games/${data?.id}/play`} label={'Play'} />
				</div>
			</div>
			<div class="game-text">
				<!-- <h1>{data?.title}</h1> -->
				<p>{data?.description}</p>
				<!-- <div class="game-tags">
					{#each data?.game?.tags as tag}
						<span>{tag}</span>
					{/each}
				</div> -->
			</div>
		</div>
	</div>
</div>

<style>
	.game-info-container {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.game-info {
		height: 100%;
		width: 60%;
		display: flex;
		flex-direction: column;
		min-width: 250px;
	}
	.game-header-image-container {
		width: 100%;
	}
	.game-header-image {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 6px;
		display: none;
	}
	.game-header-image.showImage {
		display: block;
	}
	.game-details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 6px;
		padding: 10px 0 10px 0;
	}
	.main-action-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 10px 0 10px 10px;
		gap: 10px;
	}
	.game-controls {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 10px;
	}
	.game-controls h1 {
		font-family: var(--header-font);
		color: var(--text-color-primary);
		margin-block-start: 0;
		font-weight: 400;
	}
	.game-text p {
		color: var(--text-color-primary);
		margin-block-start: 0;
	}
	.game-header-placeholder {
		width: 100%;
		height: 250px;
		border-radius: 6px;
		background-color: var(--folder-button-color);
	}
	.game-header-placeholder.hidePlaceholder {
		display: none;
	}
	@media (max-width: 490px) {
		.game-details {
			flex-direction: column-reverse;
		}
		.main-action-container {
			padding: 10px 0 20px 0;
			flex-direction: row-reverse;
			justify-content: flex-end;
		}
	}
</style>
