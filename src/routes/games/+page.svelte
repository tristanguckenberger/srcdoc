<script>
	// @ts-nocheck
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth, appClientWidth, sideBarState } from '$lib/stores/layoutStore.js';
	import { onMount } from 'svelte';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { page } from '$app/stores';
	import { gamesData } from '$lib/stores/gamesStore.js';

	export let data;

	$: currentUserId = data?.sessionData?.id;

	onMount(() => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}
		if (data?.games) {
			gamesData.set([...data?.games]);
		}
	});

	$: isMobile = $appClientWidth < 768;
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
</script>

<div class="page-container" class:noSideBar={!engineInRoute}>
	<div class="main grid" bind:clientWidth={$gridWidth} class:isMobile>
		{#each data?.games as game, i}
			<Card user={currentUserId} {game} thumbnail={`https://picsum.photos/${10 + i}`} />
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
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.main.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 10px;
		margin: 0;
		height: fit-content;
	}
	.noSideBar {
		align-items: center;
	}
</style>
