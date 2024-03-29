<script>
	// @ts-nocheck
	import GameCard from '$lib/ui/GameCard/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { writable } from 'svelte/store';
	import { tick, onMount, setContext, getContext } from 'svelte';

	export let data;

	let highlightTop = false;
	let highlightBottom = false;
	let draggedItem = null;
	let gradientPosition = 50; // Default gradient position to the middle
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

	$: if ($gamesOrder && games) {
		$gamesOrder.forEach((gameId, index) => {
			const gameIndex = games.findIndex((game) => game.id === gameId);
			if (gameIndex !== -1) {
				games[gameIndex].item_order = index + 1; // +1 to start item_order from 1 instead of 0
			}
		});
	}
</script>

<!-- 'X' close, cancel, delete -->
<!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg> -->

<!-- '+' add, create, -->
<!-- <svg
xmlns="http://www.w3.org/2000/svg"
width="32"
height="32"
fill="#ffffff"
viewBox="0 0 256 256"
><path
	d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
/></svg
> -->

<div class="playlist-page-container" class:showSideBar={$sideBarState}>
	<div class="playlist-header">
		<div class="playlist-header-title">
			<h1>{playlist?.name}</h1>
			<p>{playlist?.description}</p>
		</div>
		<div class="playlist-header-actions">
			<button class="btn btn-primary" disabled>Add Game</button>
			<button class="btn btn-secondary" disabled>Edit</button>
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
									console.log('focused::id::', game?.id);
								}}
							>
								<a href={`/games/${game?.id}/play`}>
									<svg
										on:mouseover={(e) => handleMouseOver(e, game)}
										role="button"
										tabindex="0"
										on:focus={() => {
											console.log('focused::id::', game?.id);
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
							console.log('blurred::id::', game?.id);
						}}
						on:focus={() => {
							console.log('focused::id::', game?.id);
						}}
					>
						<GameCard
							{game}
							id={game.id}
							thumbnail={game.thumbnail}
							{dragStart}
							{dragOver}
							{dragEnd}
						/>
					</div>
				{/each}
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
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
</style>
