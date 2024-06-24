<script>
	// @ts-nocheck
	import { afterUpdate, onDestroy } from 'svelte';
	import { themeDataStore } from '$lib/stores/themeStore';

	export let user;
	export let thumbnail;

	let imageLoaded = false;
	let cardImage;
	let showMoreInfo = false;
	let showMoreActions = false;
	let listWidth;

	afterUpdate(() => {
		if (cardImage) {
			imageLoaded = true;
		}
	});

	onDestroy(() => {
		user = null;
		thumbnail = null;
		imageLoaded = false;
	});

	$: cardLink = `/users/${user?.id}`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: loadedThumbnail = thumbnail ?? 'https://picsum.photos/300/300';
	$: showHover = true;
	$: showMoreInfo = listWidth < 498 || (showHover && listWidth > 498);
</script>

{#await (user, thumbnail)}
	Loading...
{:then}
	<div
		class="playlist"
		class:showHover
		style={`${themeString}`}
		bind:clientWidth={listWidth}
		aria-roledescription="list"
		role="button"
		tabindex="0"
	>
		<a href={cardLink} class="linked-card-container">
			{#if thumbnail || user?.profile_photo}
				<img
					bind:this={cardImage}
					class="card-thumbnail"
					class:showImage={imageLoaded}
					src={loadedThumbnail ?? user?.profile_photo}
					alt={user?.username}
				/>
			{:else}
				<div
					class="card-thumbnail-placeholder card-thumbnail"
					class:hidePlaceholder={thumbnail || user?.profile_photo}
				/>
			{/if}
		</a>
		<div class="card-info">
			<a href={`/users/${user?.id}`}>
				<h4>{user?.username}</h4>
				<!-- <p class="card-text">{playlist?.description}</p> -->
			</a>
			<slot name="followsButton" />
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
		background: var(--home-gradient-color-1) !important;
	}
	.card-thumbnail {
		width: 50px;
		height: 50px;
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
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		border-radius: 6px;
		flex-grow: 1;
		align-items: center;
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
	.card-info :global(.followUnfollowForm button) {
		margin-top: unset !important;
	}
</style>
