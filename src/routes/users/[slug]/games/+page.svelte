<script>
	// @ts-nocheck
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth } from '$lib/stores/layoutStore.js';
	import { afterUpdate, onMount } from 'svelte';
	import { sideBarState, sideBarWidth, appClientWidth } from '$lib/stores/layoutStore.js';
	import { page } from '$app/stores';
	import { gamesData } from '$lib/stores/gamesStore.js';

	export let data;

	$: currentUserId = data?.sessionData?.id;

	onMount(() => {
		// firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (data?.games) {
			gamesData.set([...data?.games]);
		}
	});

	afterUpdate(() => {
		if (data?.user?.id) {
			session.set(data?.user);
		}
	});

	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
</script>

<div
	class="game-page-container"
	class:noSideBar={!engineInRoute}
	class:expandSideNav={$sideBarState}
>
	<div class="main grid" bind:clientWidth={$gridWidth}>
		{#each data?.games as game, i (`game_${game?.id}_${i}`)}
			<Card id={game?.id} user={currentUserId} {game} thumbnail={game?.thumbnail} />
		{/each}
	</div>
</div>

<style>
	.game-page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.game-page-container.expandSideNav {
		width: calc(100% - 230px);
		/* overflow-x: hidden; */
	}
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 0px);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.main.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 10px;
		/* max-width: 1400px; */
		/* grid-template-rows: minmax(242px, 367px); */
		margin: 0;
		height: fit-content;
		width: calc(100% - 40px);
	}
	.noSideBar {
		align-items: center;
	}

	@media (max-width: 498px) {
		.main.grid {
			width: calc(100% - 0px);
		}
	}
</style>
