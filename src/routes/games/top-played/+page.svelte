<script>
	// @ts-nocheck
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth, appClientWidth, sideBarState } from '$lib/stores/layoutStore.js';
	import { onMount, afterUpdate } from 'svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { page } from '$app/stores';
	import { gamesData } from '$lib/stores/gamesStore.js';

	export let data;

	onMount(() => {
		firstRun.set(true);

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

	$: isMobile = $appClientWidth < 768;
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
	$: currentUserId = data?.sessionData?.id;
	$: isProfilePage =
		splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main');
	$: isBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' ||
		(splitPath[1] === 'users' && !isProfilePage && !splitPath.some((path) => path === 'users'));
	$: isUserGamesBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users';
</script>

<svelte:head>
	<meta name="google-adsense-account" content="ca-pub-9366274571597084" />
</svelte:head>

<div
	class="page-container"
	class:noSideBar={!engineInRoute}
	class:isBrowsePage
	class:isUserGamesBrowsePage
>
	<div
		class="main grid"
		bind:clientWidth={$gridWidth}
		class:isMobile
		class:showSideBar={$sideBarState}
	>
		{#each data?.games as game, i (`game_${game?.id}`)}
			<Card id={game?.id} {game} thumbnail={game?.thumbnail} />
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
		overflow-y: scroll !important;
	}
	.main.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin: 0;
		height: fit-content;
		padding: 10px 20px 20px 20px;
	}
	:global(#editor-layout) div.main.grid.isMobile {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: calc(1rem - 25%);
		padding: 0px 10px 20px 10px;
		width: calc(100% - 20px) !important;
		height: 100% !important;
		margin: 0 !important;
	}
	.noSideBar {
		align-items: center;
	}
	.main.showSideBar {
		width: calc(100% - 230px) !important;
	}
</style>
