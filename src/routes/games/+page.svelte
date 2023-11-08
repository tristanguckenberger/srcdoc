<script>
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth } from '$lib/stores/layoutStore.js';

	export let data;
</script>

<div class="main grid" bind:clientWidth={$gridWidth}>
	{#each data?.games as game, i}
		<Card {game} thumbnail={`https://picsum.photos/${10 + i}`} />
	{/each}
</div>

<style>
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		/* overflow-y: hidden; */
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.main.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 10px;
		max-width: 1400px;
	}
</style>
