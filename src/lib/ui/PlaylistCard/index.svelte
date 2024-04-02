<script>
	// @ts-nocheck
	import { afterUpdate, onMount, onDestroy, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { browser } from '$app/environment';

	export let playlist;
	export let id;
	export let thumbnail;

	let imageLoaded = false;
	let cardImage;
	let showMoreInfo = false;
	let showMoreActions = false;
	let playlistWidth;

	const mousedOverItemId = getContext('playlistContext')?.mousedOverItemId;

	const handleMouseOver = (e, game) => {
		$mousedOverItemId = null;
		$mousedOverItemId = game?.id;
	};

	const handleToggleMoreActions = (e) => {
		showMoreActions = !showMoreActions;
	};

	const handleMouseOut = (e, game) => {
		// if the target doesnt contain the play button or isnt the play button itself or its svg, hide it
		// if (
		// 	!e.relatedTarget?.classList.contains('play-button-container') &&
		// 	!e.relatedTarget?.classList.contains('action-button-icon') &&
		// 	!e.relatedTarget?.classList.contains('linked-card-container') &&
		// 	!e.relatedTarget?.tagName === 'svg' &&
		// 	!e.relatedTarget?.classList?.contains('card-thumbnail-placeholder')
		// ) {
		// 	$mousedOverItemId = null;
		// } else if (
		// 	e.relatedTarget?.classList?.contains('playlist-page-container') ||
		// 	e.relatedTarget?.classList?.contains('playlist') ||
		// 	e.relatedTarget?.classList?.contains('playlist-header') ||
		// 	e.relatedTarget?.classList?.contains('playlist-header-title') ||
		// 	e.relatedTarget?.classList?.contains('playlist-header-actions') ||
		// 	e.relatedTarget?.classList?.contains('playlist-game-container')
		// ) {
		// 	$mousedOverItemId = null;
		// }
		$mousedOverItemId = null;
		showMoreActions = false;
	};

	afterUpdate(() => {
		if (cardImage) {
			imageLoaded = true;
		}
	});

	onDestroy(() => {
		user = null;
		playlist = null;
		id = null;
		thumbnail = null;
		imageLoaded = false;
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: cardLink = `/games/${id}/play`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: user = $session;
	$: loadedThumbnail = thumbnail ?? 'https://picsum.photos/300/300';
	$: showHover = $mousedOverItemId?.toString() === id?.toString();
	$: showMoreInfo = playlistWidth < 498 || (showHover && playlistWidth > 498);
	$: console.log('playlistDAta::', playlist);
	$: isOwner = user?.id.toString() === playlist?.owner_id.toString();
	$: {
		if (playlistWidth < 498) {
			showMoreInfo = true;
		}
	}
</script>

<svelte:window
	on:click={(e) => {
		console.log('click_target::classList::', e.target.classList);

		// if the target doesnt contain 'more-actions-container', or 'more-action-button', hide the more actions
		if (
			!e.target.classList.contains('more-actions-container') &&
			!e.target.classList.contains('more-action-button') &&
			!e.target.classList.contains('more-actions') &&
			!e.target.classList.contains('show')
		) {
			console.log(e.target.classList);
			showMoreActions = false;
		}
	}}
/>

{#await (playlist, id, thumbnail, user)}
	Loading...
{:then}
	<div
		class="playlist"
		class:showHover
		style={`${themeString}`}
		bind:clientWidth={playlistWidth}
		on:mouseover={(e) => handleMouseOver(e, playlist)}
		on:mouseleave={(e) => handleMouseOut(e, playlist)}
		on:touchstart={(e) => handleMouseOver(e, playlist)}
		on:blur={() => {
			$mousedOverItemId = null;
			// showMoreActions = false;
		}}
		on:focus={() => {
			console.log('focused');
		}}
		aria-roledescription="playlist"
		role="button"
		tabindex="0"
	>
		<a href={cardLink} class="linked-card-container">
			<img
				bind:this={cardImage}
				class="card-thumbnail"
				class:showImage={imageLoaded}
				src={loadedThumbnail ?? playlist?.thumbnail}
				alt={playlist?.name}
			/>

			<div class="card-thumbnail-placeholder" class:hidePlaceholder={imageLoaded} />
		</a>
		<div class="card-info">
			<a href={`/playlists/${id}`}>
				<h4>{playlist?.name ?? playlist?.title}</h4>
				<p class="card-text">{playlist?.description}</p>
			</a>
			<div class="more-actions" class:show={showMoreInfo} on:click={handleToggleMoreActions}>
				...

				{#if showMoreActions}
					<div class="more-actions-container">
						{#if isOwner}<button class="more-action-button" on:click|preventDefault={() => {}}
								>Edit</button
							>{/if}
						{#if !playlist?.is_category}<button
								class="more-action-button"
								on:click|preventDefault={() => {
									console.log('delete_playlist::', playlist?.id);
								}}>{isOwner ? 'Delete' : 'Remove from library'}</button
							>{/if}
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
		width: calc(100% - 20px);
		height: 50px;
		border-radius: 6px;
		margin: 0;
		padding: 10px;
		/* background: #32323229; */
		transition: background 0.09s linear(0.07 -1.12%, 1 100%);
	}
	.playlist:hover {
		cursor: pointer;
		background: var(--search-result-card) !important;
	}
	.card-thumbnail {
		width: 100%;
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
		width: 100%;
		height: 100%;
		border-radius: 6px;
		background-color: var(--folder-button-color);
		opacity: 1;
		position: absolute;
		top: 0;
		transition: opacity 0.03s;
		min-width: 50px;
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
		height: 150px;
		width: 200px;
		gap: 10px;
	}
	.more-actions-container:hover {
		cursor: default;
	}
	.more-action-button:hover {
		cursor: pointer;
	}
</style>
