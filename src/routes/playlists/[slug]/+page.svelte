<script>
	// @ts-nocheck
	import GameCard from '$lib/ui/GameCard/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';

	export let data;

	$: console.log('data::', data);

	$: games = data?.games;

	// $: games = data?.games?.map((game) => {
	// 	console.log('game::', game);
	// 	return {
	// 		id: game.id,
	// 		name: game.title,
	// 		description: game.description,
	// 		thumbnail: game.thumbnail,
	// 		published: game.published
	// 	};
	// });
	$: console.log('games::', games);
	$: sessionData = data?.sessionData;
</script>

<div class="playlist-game-container" class:showSideBar={$sideBarState}>
	{#await games}
		<p>Loading...</p>
	{:then games}
		{#if games.length > 0}
			{#each games as game}
				<GameCard {game} id={game.id} thumbnail={game.thumbnail} />
			{/each}
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>

<style>
	.playlist-game-container {
		width: 100%;
		padding: 0 10px;
	}
	.playlist-game-container.showSideBar {
		width: calc(100% - 250px);
	}
</style>
