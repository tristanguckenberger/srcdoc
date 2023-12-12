<script>
	// @ts-nocheck

	/**
	 * Path: game/[slug]/main/[+page].svelte
	 * Type: Route Page
	 * Description: This is the main "profile" page for a game.
	 *
	 * The Route displays the game's:
	 * - header image
	 * - title
	 * - description
	 * - (TODO) total play count
	 * - (TODO) # of favorites
	 * - (TODO) average review rating
	 * - switchable widget component:
	 * 	- comments:
	 * 	 	- displays all general comments/replys/(TODO) reactions
	 * 	 	- users can update their own comments/(TODO) replys/(TODO) reactions
	 * 	 	- (TODO) users can delete their own comments/replys/reactions
	 * 	- (TODO) issues
	 * 	- (TODO) reviews
	 *
	 * It will also display a button to open the game in the engine, and a button to play the game.
	 *
	 */

	// svelte imports
	import { onDestroy, onMount } from 'svelte';

	// custom store imports
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import { commentStoreComments } from '$lib/stores/commentStore.js';
	import { modalOpenState, modalComponent, modalProps } from '$lib/stores/layoutStore.js';
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
		firstRun
	} from '$lib/stores/filesStore.js';

	// component imports
	import Button from '$lib/ui/Button/index.svelte';
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';

	export let data;

	let imageExpanded = false;
	let imageLoaded = false;
	let reactiveData = {};

	function openModal() {
		modalComponent.set(EditGameDetails);
		modalProps.set({
			gameId: data?.id,
			title: data?.title,
			description: data?.description,
			headerImage: data?.headerImage
		});
		modalOpenState.set(true);
	}
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
		commentStoreComments.set(null);
	});

	$: themeString = $themeDataStore?.theme?.join(' ');
	$: data?.comments, (reactiveData = data ?? {});
</script>

<div class="game-info-container" style={`${themeString}`}>
	<div class="game-info">
		<div class="header-detail">
			<div class="game-header-image-container">
				<img
					class="game-header-image"
					class:showImage={imageLoaded}
					class:expanded={imageExpanded}
					src={data?.headerImage ?? 'https://picsum.photos/2000/300'}
					on:load={() => {
						imageLoaded = true;
					}}
				/>
				<div class="game-header-placeholder" class:hidePlaceholder={imageLoaded} />
			</div>
			<div class="game-details">
				<h1>{data?.title}</h1>
				<div class="game-text">
					<p>{data?.description}</p>
				</div>
			</div>
		</div>
		<div class="game-controls">
			<div class="main-action-container">
				{#if data?.user_id === data?.sessionData?.id}
					<div class="edit"><Button action={() => openModal()} label={'Edit Game Details'} /></div>
				{/if}
				<Button link={`/games/${data?.id}/engine`} label={'Open in Engine'} />
				<div class="trailing-btn"><Button link={`/games/${data?.id}/play`} label={'Play'} /></div>
			</div>
		</div>
		<Widget content={reactiveData} />
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
		padding: 0 20px;
		display: flex;
		flex-direction: column;
		min-width: 250px;
		max-width: 968px;
		width: 100%;
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
	.game-header-image.showImage.expanded {
		width: 100%;
		height: 450px;
		object-fit: cover;
		border-radius: 6px;
	}
	.game-details {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		padding: 10px 0 10px 0;
		min-width: 35%;
	}
	.game-details h1 {
		font-family: var(--header-font);
		color: var(--color-primary);
		margin-block-start: 0;
		margin-block-end: 0.5rem;
	}
	.main-action-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 10px 0 10px 0;
		gap: 10px;
	}
	.main-action-container :global(button),
	.main-action-container :global(a) {
		background-color: var(--button-highlight) !important;
	}
	.game-controls {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 10px;
	}
	.game-text p {
		color: var(--text-color-primary);
		margin-block-start: 0;
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 400;
		font-size: 0.9rem;
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
	@media (max-width: 900px) {
		.main-action-container {
			flex-direction: column;
		}
		.trailing-btn {
			align-self: flex-end;
		}
	}

	@media (max-width: 490px) {
		.main-action-container {
			padding: 10px 0 20px 0;
			flex-direction: column;
			justify-content: flex-end;
		}
	}
	.main-action-container div.edit :global(button) {
		background-color: rgb(26 27 29);
		height: 36.5px;
	}
	.header-detail {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20px;
	}
</style>
