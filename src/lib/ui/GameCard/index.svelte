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

	export let game;
	export let id;
	export let thumbnail;
	export let dragStart;
	export let dragOver;
	export let dragEnd;

	const mousedOverItemId = getContext('playlistContext')?.mousedOverItemId;

	let imageLoaded = false;
	let cardImage;
	let showMoreInfo = false;

	afterUpdate(() => {
		if (cardImage) {
			imageLoaded = true;
		}
	});

	onDestroy(() => {
		user = null;
		game = null;
		id = null;
		thumbnail = null;
		imageLoaded = false;
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: cardLink = `/playlists/${id}/play`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: user = $session;
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
		on:focus={() => {
			console.log('focused');
		}}
		on:dragstart={(e) => dragStart(e, game)}
		on:dragover={(e) => dragOver(e, game)}
		on:dragend={dragEnd}
		aria-roledescription="playlist"
		role="button"
		tabindex="0"
	>
		<a href={cardLink} class="linked-card-container" tabindex="0">
			<img
				bind:this={cardImage}
				class="card-thumbnail"
				class:showImage={imageLoaded}
				src={loadedThumbnail ?? game?.thumbnail}
				alt={game?.title}
			/>
			<div class="card-thumbnail-placeholder" class:hidePlaceholder={imageLoaded} />
		</a>
		<div class="card-info">
			<a href={`/games/${id}/play`}>
				<h4>{game?.title}</h4>
				<p>{game?.description}</p>
			</a>
			<div class="more-actions" class:show={showMoreInfo}>...</div>
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
	.playlist.showHover {
		cursor: pointer;
		background: var(--search-result-card);
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
</style>
