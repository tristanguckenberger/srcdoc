<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { tick, onMount, setContext, getContext } from 'svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';

	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore.js';
	import { playButton } from '$lib/stores/gamesStore.js';

	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import GameCard from '$lib/ui/GameCard/index.svelte';
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';
	import { session } from '$lib/stores/sessionStore.js';

	export let data;

	let componentOptions = [];
	let highlightTop = false;
	let highlightBottom = false;
	let draggedItem = null;
	let gradientPosition = 50; // Default gradient position to the middle
	let isOwner = false;
	const gamesOrder = writable([]);
	const draggingOver = writable(false);
	const draggingOverGameId = writable(null);
	// const mousedOverItemId = writable(null);
	// const showPlayButtonStore = writable(false);

	setContext('playlistContext', {
		mousedOverItemId: writable(null),
		showPlayButtonStore: writable(false)
	});

	const { mousedOverItemId, showPlayButtonStore } = getContext('playlistContext');

	$: playlist = data?.playlist;
	$: games = data?.games;
	$: sessionData = data?.sessionData;
	$: isOwner = sessionData?.id === playlist?.ownerId;

	onMount(() => {
		if (games && games.length > 0) {
			const initialOrder = games.sort((a, b) => a.item_order - b.item_order).map((game) => game.id);
			gamesOrder.set(initialOrder);
		}
	});

	function dragStart(e, game) {
		e.dataTransfer.effectAllowed = 'all';
		draggedItem = game;
	}

	function dragOver(e, game) {
		e.preventDefault();
		$draggingOver = true;
		$draggingOverGameId = game.id;

		const targetElement = document.getElementById(`game_${game.id}`);
		const targetRect = targetElement.getBoundingClientRect();
		const relativeY = e.clientY - targetRect.top;
		const percentage = (relativeY / targetRect.height) * 100;
		gradientPosition = Math.min(Math.max(100 - percentage, 0), 100); // Clamp between 0 and 100
	}

	function dragEnd() {
		draggedItem = null;
		$draggingOver = false;
		$draggingOverGameId = null;
	}

	async function drop(e, game) {
		e.preventDefault();
		if (draggedItem === null) return;

		await tick();

		const draggedIndex = games.findIndex((f) => f.id === draggedItem.id);
		const targetIndex = games.findIndex((f) => f.id === game.id);

		if (draggedIndex === targetIndex) return;
		// Determine the drop position relative to the target element's bounds
		const targetElement = document.getElementById(`game_${game.id}`);
		const targetRect = targetElement.getBoundingClientRect();
		const dropPositionY = e.clientY - targetRect.top;
		const newGames = [...games];
		const [removedItem] = newGames.splice(draggedIndex, 1);

		if (
			e.clientY - e.target.getBoundingClientRect().top < e.target.offsetHeight / 2 ||
			dropPositionY < targetRect.height / 2
		) {
			if (draggedIndex > targetIndex) {
				// When the dragged item originally was after the target item
				newGames.splice(targetIndex, 0, removedItem);
			} else {
				// When the dragged item originally was before the target item
				newGames.splice(targetIndex, 0, removedItem);
			}
		} else {
			// If drop is in the lower half
			if (draggedIndex > targetIndex) {
				// When the dragged item originally was after the target item
				newGames.splice(targetIndex + 1, 0, removedItem);
			} else {
				// When the dragged item originally was before the target item
				// Adjusting because the target index effectively shifts due to the removal
				newGames.splice(targetIndex, 0, removedItem);
			}
		}

		// games = newGames.sort((a, b) => a.item_order - b.item_order); // Re-sort games based on item_order after update

		games = newGames;
		// Update the games order after reordering
		const newOrder = games.map((game) => game.id);
		gamesOrder.set(newOrder);

		$draggingOver = false;
		$draggingOverGameId = null;

		// Fetch Playlist API to update the item_order
		await tick();
		await handleUpdatePlaylistOrder(newOrder);
	}

	const handleMouseOver = (e, game) => {
		$showPlayButtonStore = false;
		$mousedOverItemId = null;
		$showPlayButtonStore = true;
		$mousedOverItemId = game?.id;
	};

	const handleMouseOut = (e, game) => {
		// if the target doesnt contain the play button or isnt the play button itself or its svg, hide it
		if (
			!e.relatedTarget?.classList.contains('play-button-container') &&
			!e.relatedTarget?.classList.contains('action-button-icon') &&
			!e.relatedTarget?.classList.contains('linked-card-container') &&
			!e.relatedTarget?.tagName === 'svg' &&
			!e.relatedTarget?.classList?.contains('card-thumbnail-placeholder')
		) {
			$showPlayButtonStore = false;
			$mousedOverItemId = null;
		} else if (
			e.relatedTarget?.classList?.contains('playlist-page-container') ||
			e.relatedTarget?.classList?.contains('playlist') ||
			e.relatedTarget?.classList?.contains('playlist-header') ||
			e.relatedTarget?.classList?.contains('playlist-header-title') ||
			e.relatedTarget?.classList?.contains('playlist-header-actions') ||
			e.relatedTarget?.classList?.contains('playlist-game-container')
		) {
			$showPlayButtonStore = false;
			$mousedOverItemId = null;
		}
	};

	const handleUpdatePlaylistOrder = async (newOrder) => {
		// Fetch Playlist API to update the item_order
		const response = await fetch(`/api/playlist/${playlist?.id}/gamesOrder`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ gamesOrder: newOrder })
		});
	};

	const handleEdit = () => {
		console.log('edit playlist', $session);
		if (!$session?.id) return;
		$playButton = false;
		selectedOption.set(0);
		$playButton = false;
		$drawerOpen = true;
	};

	const handleAddToLibrary = async () => {
		if (!$session?.id) return;
		const response = await fetch(`/api/playlist/${playlist?.id}/savePlaylist`);
		const data = await response.json();

		invalidateAll();
	};
	$: if ($gamesOrder && games) {
		$gamesOrder.forEach((gameId, index) => {
			const gameIndex = games.findIndex((game) => game.id === gameId);
			if (gameIndex !== -1) {
				games[gameIndex].item_order = index + 1; // +1 to start item_order from 1 instead of 0
			}
		});
	}
	$: (() => {
		return (componentOptions = [
			{
				name: 'EditPlaylist',
				props: {
					name: playlist?.name ?? 'New Playlist',
					description: playlist?.description ?? 'New Playlist Description',
					isPublic: Boolean(playlist?.is_public ?? playlist?.isPublic),
					playlistId: playlist?.id,
					thumbnail: playlist?.thumbnail
				},
				component: EditPlaylistDetails
			}
		]);
	})();
	$: isPublic = Boolean(playlist?.is_public ?? playlist?.isPublic);
	$: isSaved = Boolean(playlist?.isSaved);
</script>

<div class="playlist-page-container" class:showSideBar={$sideBarState}>
	<div class="playlist-header">
		<div class="playlist-header-title">
			<h1>{playlist?.name}</h1>
			<p>{playlist?.description}</p>
			{#if isPublic}
				<p>Public</p>
			{:else}
				<p>Private</p>
			{/if}
		</div>

		<div class="playlist-header-actions">
			{#if isOwner}
				<button class="btn btn-primary" disabled>Add Game</button>
				<button class="btn btn-secondary" disabled={!isOwner} on:click|preventDefault={handleEdit}
					>Edit</button
				>
			{/if}
			{#if !isSaved}
				<button
					class:muted={!$session?.id}
					disabled={!$session?.id}
					class="btn btn-secondary"
					on:click|preventDefault={!playlist?.isSaved
						? handleAddToLibrary
						: () => {
								// console.log('already saved to library');
						  }}>Add to Library</button
				>
			{:else if isOwner && isSaved}
				<button
					class="btn btn-secondary"
					class:muted={!$session?.id}
					disabled={!$session?.id}
					on:click|preventDefault={async () => {
						if (!$session?.id) return;
						const deltePlaylistRes = await fetch(`/api/playlist/${playlist?.id}/delete`);
						if (deltePlaylistRes.ok) {
							await tick();
							// invalidateAll();
							goto('/games');
						}
					}}>Delete</button
				>
			{:else if !isOwner && isSaved}
				<button
					class="btn btn-secondary"
					class:muted={!$session?.id}
					disabled={!$session?.id}
					on:click|preventDefault={async () => {
						if (!$session?.id) return;
						const deletePlaylistRes = await fetch(`/api/playlist/${playlist?.id}/removePlaylist`);
						if (deletePlaylistRes.ok) {
							await tick();
							invalidateAll();
						}
					}}>Remove from Library</button
				>
			{/if}
		</div>
	</div>
	<div class="playlist-game-container">
		{#await games}
			<p>Loading...</p>
		{:then games}
			{#if games.length > 0}
				{#each games as game, i}
					{#if $showPlayButtonStore && game.id === $mousedOverItemId}
						<div class="tiny-absolute">
							<div
								class="play-button-container"
								on:mouseover={(e) => handleMouseOver(e, game)}
								on:mouseout={(e) => handleMouseOut(e, game)}
								role="button"
								tabindex="0"
								on:focus={() => {
									// console.log('focused::id::', game?.id);
								}}
								on:blur={() => {
									// console.log('blurred::id::', game?.id);
								}}
							>
								<a href={`/games/${game?.id}/play`}>
									<svg
										on:mouseover={(e) => handleMouseOver(e, game)}
										role="button"
										tabindex="0"
										on:focus={() => {
											// console.log('focused::id::', game?.id);
										}}
										class="action-button-icon"
										width="37"
										height="44"
										viewBox="0 0 37 44"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M36.5 21.5692C36.5014 22.1325 36.3569 22.6866 36.0807 23.1776C35.8045 23.6685 35.406 24.0797 34.9239 24.371L5.04364 42.65C4.53987 42.9585 3.96288 43.1269 3.37226 43.1379C2.78165 43.1488 2.19882 43.0019 1.68398 42.7122C1.17403 42.4271 0.749237 42.0113 0.453271 41.5076C0.157306 41.0039 0.000852063 40.4304 0 39.8462V3.29226C0.000852063 2.70802 0.157306 2.13455 0.453271 1.63082C0.749237 1.1271 1.17403 0.711297 1.68398 0.426177C2.19882 0.136559 2.78165 -0.0103683 3.37226 0.000568957C3.96288 0.0115063 4.53987 0.179912 5.04364 0.488393L34.9239 18.7674C35.406 19.0587 35.8045 19.4699 36.0807 19.9608C36.3569 20.4518 36.5014 21.0059 36.5 21.5692Z"
											fill="white"
										/>
									</svg>
								</a>
							</div>
						</div>
					{/if}
					<div
						id={`game_${game.id}`}
						class="game-container"
						on:drop={(e) => drop(e, game)}
						class:isDraggingOver={$draggingOver && $draggingOverGameId === game.id}
						class:shouldHighlightTop={$draggingOver &&
							$draggingOverGameId === game.id &&
							highlightTop}
						class:shouldHighlightBottom={$draggingOver &&
							$draggingOverGameId === game.id &&
							highlightBottom}
						style={`--gradient-position: ${gradientPosition}%;`}
						role="link"
						tabindex={i}
						on:mouseover={(e) => handleMouseOver(e, game)}
						on:mouseout={handleMouseOut}
						on:blur={() => {
							// console.log('blurred::id::', game?.id);
						}}
						on:focus={() => {
							// console.log('focused::id::', game?.id);
						}}
					>
						<GameCard
							{game}
							id={game.id}
							thumbnail={game.thumbnail}
							{dragStart}
							{dragOver}
							{dragEnd}
							{playlist}
							user={sessionData}
						/>
					</div>
				{/each}
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget content={data} options={componentOptions} />
		</div>
	</Drawer>
</div>

<style>
	.playlist-page-container {
		width: 100%;
		padding: 0 10px;
	}
	.playlist-page-container.showSideBar {
		width: calc(100% - 250px);
		margin-top: 20px;
	}
	.playlist-game-container {
		display: flex;
		flex-direction: column;
	}
	.game-container {
		overflow: hidden;
		border-radius: 6px;
		transition: linear-gradient 0.09s linear(0.07 -1.12%, 1 100%);
	}
	.game-container.isDraggingOver {
		background: rgb(18, 19, 20);
		background: linear-gradient(
			0deg,
			rgba(18, 19, 20, 1) calc(var(--gradient-position) - 80%),
			var(--sidbar-highlight) var(--gradient-position),
			rgba(18, 19, 20, 1) calc(var(--gradient-position) + 80%)
		);
	}
	.tiny-absolute {
		position: relative;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
	}
	.play-button-container {
		position: absolute;
		top: calc(50% + 25px);
		left: calc(50% + 25px);
		z-index: 10;
	}
	.play-button-container svg {
		width: 20px;
		height: 20px;
	}
	.play-button-container svg:hover {
		cursor: pointer;
	}
	.playlist-header {
		padding-bottom: 40px;
	}
	.playlist-header-title {
		color: var(--color-primary);
		font-family: var(--header-font);
		padding: 0 20px;
	}
	.playlist-header-title p {
		color: var(--color-primary);
		font-weight: 300;
		font-family: var(--paragraph-font);
	}
	button.muted {
		opacity: 0.3;
	}
	button.muted:hover {
		cursor: not-allowed;
	}
</style>
