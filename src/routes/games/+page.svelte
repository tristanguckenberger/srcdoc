<script>
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth } from '$lib/stores/layoutStore.js';
	import { onMount } from 'svelte';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { page } from '$app/stores';

	export let data;

	onMount(() => {
		firstRun.set(true);
	});

	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
</script>

<div class="page-container" class:noSideBar={!engineInRoute}>
	<div class="main grid" bind:clientWidth={$gridWidth}>
		{#each data?.games as game, i}
			<Card {game} thumbnail={`https://picsum.photos/${10 + i}`} />
		{/each}
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
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
		margin: 0;
	}
	.noSideBar {
		align-items: center;
	}
</style>
