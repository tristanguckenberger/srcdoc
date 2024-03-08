<script>
	// @ts-nocheck
	import GameCard from '$lib/ui/GameCard/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { writable } from 'svelte/store';
	import { tick } from 'svelte';

	export let data;

	let highlightTop = false;
	let highlightBottom = false;
	let draggedItem = null;
	let gradientPosition = 50; // Default gradient position to the middle
	const draggingOver = writable(false);
	const draggingOverGameId = writable(null);

	$: playlist = data?.playlist;
	$: games = data?.games;
	$: sessionData = data?.sessionData;

	function dragStart(e, game) {
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
		// highlightTop = false;
		// highlightBottom = false;
	}

	async function drop(e, game) {
		e.preventDefault();
		if (draggedItem === null) return;

		await tick();

		const draggedIndex = games.findIndex((f) => f.id === draggedItem.id);
		const targetIndex = games.findIndex((f) => f.id === game.id);

		// Avoid action if the game is dragged onto itself
		if (draggedIndex === targetIndex) return;

		// Determine the drop position relative to the target element's bounds
		const targetElement = document.getElementById(`game_${game.id}`);
		const targetRect = targetElement.getBoundingClientRect();
		const dropPositionY = e.clientY - targetRect.top;

		const newGames = [...games];

		// Remove the dragged item from its original position
		const [removedItem] = newGames.splice(draggedIndex, 1);

		// Decide where to insert the item based on the drop position
		if (dropPositionY < targetRect.height / 2) {
			// If drop is in the upper half, insert before the target
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

		games = newGames;
		$draggingOver = false;
		$draggingOverGameId = null;
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
	.game-container {
		overflow: hidden;
		border-radius: 6px;
		transition: linear-gradient 0.09s linear(0.07 -1.12%, 1 100%);
	}
	.game-container.isDraggingOver {
		background: rgb(18, 19, 20);
		background: linear-gradient(
			0deg,
			rgba(18, 19, 20, 1) calc(var(--gradient-position) - 50%),
			var(--sidbar-highlight) var(--gradient-position),
			rgba(18, 19, 20, 1) calc(var(--gradient-position) + 50%)
		);
	}
</style>
