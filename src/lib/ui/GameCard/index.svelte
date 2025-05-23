<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
	// @ts-nocheck
	import { afterUpdate, onMount, onDestroy, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { beforeNavigate, invalidateAll, goto, invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore.js';
	import { playButton } from '$lib/stores/gamesStore.js';
	import { page } from '$app/stores';
	import { platformSession } from '$lib/stores/platformSession';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	export let game;
	export let id;
	export let thumbnail;
	export let dragStart;
	export let dragOver;
	export let dragEnd;
	export let playlist;
	export let user;

	$: isOwner =
		user?.id?.toString() === playlist?.owner_id?.toString() ||
		user?.id?.toString() === playlist?.ownerId?.toString();

	const mousedOverItemId = getContext('playlistContext')?.mousedOverItemId;

	let imageLoaded = false;
	let cardImage;
	let showMoreInfo = true;
	let showMoreActions = false;
	let playlistId;
	let isPlaylistSlider;
	let cardLink;

	afterUpdate(async () => {
		if (cardImage) {
			imageLoaded = true;
		}
	});

	const handleToggleMoreActions = (e) => {
		showMoreActions = !showMoreActions;
	};

	onDestroy(() => {
		user = null;
		game = null;
		id = null;
		thumbnail = null;
		imageLoaded = false;
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: playlistId = $page?.params?.slug;
	$: isPlaylistSlider = $page?.route?.id == '/playlists/[slug]';
	$: cardLink = isPlaylistSlider ? `/games/playlist/${playlistId}/${id}/play` : `/games/${id}/play`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: user = $platformSession?.currentUser;
	$: loadedThumbnail = thumbnail ?? 'https://picsum.photos/300/300';
	$: showHover = $mousedOverItemId?.toString() === id?.toString();
	$: showMoreInfo = showHover;
</script>

{#await (game, id, thumbnail, user)}
	Loading...
{:then}
	<div
		class="playlist game-card"
		class:showHover
		style={`${themeString}`}
		on:focus={() => {}}
		on:dragstart={(e) => dragStart(e, game)}
		on:dragover={(e) => dragOver(e, game)}
		on:dragend={dragEnd}
		aria-roledescription="playlist"
		role="button"
		tabindex="0"
	>
		<a href={cardLink} class="linked-card-container" tabindex="0">
			{#if thumbnail || playlist?.thumbnail}
				<img
					bind:this={cardImage}
					class="card-thumbnail"
					class:showImage={imageLoaded}
					src={loadedThumbnail ?? game?.thumbnail}
					alt={game?.title}
				/>
			{:else}
				<div
					class="card-thumbnail-placeholder card-thumbnail"
					class:hidePlaceholder={thumbnail || playlist?.thumbnail}
				>
					<ImagePlaceHolder />
				</div>
			{/if}
		</a>
		<div class="card-info">
			<a href={cardLink}>
				<h4>{game?.title}</h4>
				<p>{game?.description}</p>
			</a>
			<div class="more-actions" class:show={showMoreInfo} on:click={handleToggleMoreActions}>
				...

				{#if showMoreActions}
					<div
						class="more-actions-container"
						on:mouseover={() => {
							showMoreActions = true;
							showHover = true;
						}}
					>
						{#if isOwner}<button
								class="more-action-button"
								class:muted={!$platformSession?.currentUser?.id}
								on:click={async () => {
									if (!$platformSession?.currentUser?.id) return;
									goto(`/games/${game?.id}/play`).then(() => {
										$selectedOption = 3;
										$playButton = false;
										$drawerOpen = true;
									});
								}}
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="#000000"
									viewBox="0 0 256 256"
									><path
										d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"
									/></svg
								>Edit Details</button
							>

							<button
								class="more-action-button"
								class:muted={!$platformSession?.currentUser?.id}
								on:click|preventDefault={async () => {
									if (!$platformSession?.currentUser?.id) return;
									const deltePlaylistRes = await fetch(`/api/playlist/${playlist?.id}/removeGame`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											gameId: game?.id
										})
									});
									if (deltePlaylistRes.ok && isOwner) {
										await tick();
										invalidateAll();
									} else if (deltePlaylistRes.ok && !isOwner) {
										await tick();
										invalidateAll();
									}
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="#000000"
									viewBox="0 0 256 256"
									><path
										d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
									/></svg
								>Remove from Playlist</button
							>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/await}

<style>
	.playlist {
		display: flex;
		flex-direction: row;
		/* width: calc(100% - 20px); */
		height: 50px;
		border-radius: 6px;
		margin: 0;
		padding: 10px;
		/* background: #32323229; */
		transition: background 0.09s linear(0.07 -1.12%, 1 100%);
	}
	.playlist.showHover {
		cursor: pointer;
		background: var(--search-result-card);
	}
	.card-thumbnail {
		width: 50px;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
		transition: opacity 0.03s;
		opacity: 0;
		min-width: 50px;
	}
	.card-thumbnail.showImage {
		opacity: 1;
	}
	.card-thumbnail-placeholder {
		background-color: var(--folder-button-color);
		opacity: 1;
		overflow: hidden;
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		/* justify-content: space-between; */
		height: 100%;
		border-radius: 6px;
		flex-grow: 1;
	}
	.card-info p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
		/* margin-inline-start: 2px; */
	}
	.card-info a {
		color: var(--color-primary);
		text-decoration: none;
		/* max-width: 55%; */
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 5px;
		padding: 0 0 0 10px;
		width: 100%;
	}
	.card-info a h4 {
		margin-block-start: 0;
		font-family: 'Inter';
		font-weight: 450;
		margin-block-end: 0;
		font-size: 1rem;
		text-overflow: ellipsis;
		max-block-size: fit-content;
	}
	.card-info:hover {
		cursor: pointer;
	}
	.card-thumbnail-placeholder.hidePlaceholder {
		opacity: 0;
	}
	.linked-card-container {
		position: relative;
	}
	@media (max-width: 498px) {
		.playlist {
			width: calc(100% - 40px);
		}
		.card-info {
			padding: 0 41px 0 10px;
			width: calc(100% - 113px);
		}
	}
	.more-actions {
		align-self: center;
		align-items: center;
		justify-content: center;
		position: relative;
		bottom: 7px;
		font-size: 2rem;
		display: none;
	}
	.more-actions.show {
		display: flex;
	}
	.more-actions-container {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 40px;
		right: 10px;
		background: var(--nav-dropdown);
		border-radius: 6px;
		padding: 10px;
		height: fit-content;
		width: 200px;
		/* gap: 10px; */
		z-index: 10;
	}
	.more-actions-container:hover {
		cursor: default;
	}
	.more-action-button {
		background: none;
		color: var(--color-primary);
		border: none;
		height: 36px;
		border-radius: 3px;
		font-family: var(--action-font);
		font-weight: 600;
		font-size: 0.9rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.more-action-button:hover {
		cursor: pointer;
		background: var(--slider-drawer);
	}

	.more-action-button svg {
		width: 25px;
		fill: var(--folder-button-color);
		padding-right: 8px;
	}
	:global(.game-container) {
		overflow: unset !important;
	}
	button.muted {
		opacity: 0.3;
	}
	button.muted:hover {
		cursor: not-allowed;
	}
</style>
