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
	import Comment from '$lib/ui/Comment/Index.svelte';
	import { commentStoreComments } from '$lib/stores/commentStore.js';
	import {
		modalState,
		modalOpenState,
		modalComponent,
		modalProps
	} from '$lib/stores/layoutStore.js';
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';

	export let data;

	onMount(() => {
		// firstRun.set(true);
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
	let imageLoaded = false;

	// $: console.log('data::', data);

	const openModal = () => {
		// console.log('data::atModalOpen', data);
		modalComponent.set(EditGameDetails);
		modalProps.set({
			gameId: data?.id,
			title: data?.title,
			description: data?.description,
			headerImage: data?.headerImage
		});
		modalOpenState.set(true);
	};
	$: console.log('data::games/slug/main', data);
</script>

<div class="game-info-container" style={`${themeString}`}>
	<div class="game-info">
		<div class="header-detail">
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
		<Widget content={data} />
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
		border-radius: 6px;
		padding: 10px 0 10px 0;
		min-width: 35%;
	}
	.game-details h1 {
		font-family: var(--header-font);
		color: var(--color-primary);
		margin-block-start: 0;
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
	.comment-container {
		background-color: var(--text-box);
		padding: 10px;
		border-radius: 4px;
		min-height: 75px;
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
		background-color: rgb(32 33 36);
		height: 36.5px;
	}
	.header-detail {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20px;
	}
</style>
