<script>
	// @ts-nocheck
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth, appClientWidth, sideBarState } from '$lib/stores/layoutStore.js';
	import { onMount, } from 'svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { page } from '$app/stores';
	import { gamesData } from '$lib/stores/gamesStore.js';
	import { platformSession } from '$lib/stores/platformSession/index.js';
	import AccountVerificationNotice from '$lib/ui/AccountVerificationNotice/index.svelte';

	let { data } = $props();

	onMount(() => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (data?.games) {
			gamesData.set([...data?.games]);
		}
	});

	let isMobile = $derived($appClientWidth < 768);
	let splitPath = $derived($page?.route?.id?.split('/') ?? []);
	let engineInRoute = $derived($page?.route?.id?.split('/').some((path) => path === 'engine'));
	let currentUserId = $derived(data?.sessionData?.id);
	let isProfilePage =
		$derived(splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main'));
	let isBrowsePage =
		$derived(splitPath[splitPath?.length - 1] === 'games' ||
		(splitPath[1] === 'users' && !isProfilePage && !splitPath.some((path) => path === 'users')));
	let isUserGamesBrowsePage =
		$derived(splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users');
</script>

<svelte:head />

<div
	class="page-container"
	class:noSideBar={!engineInRoute}
	class:isBrowsePage
	class:isUserGamesBrowsePage
>
	{#if !data?.isActive && $platformSession?.currentUser?.id}
		<AccountVerificationNotice />
	{/if}
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
	:global(#editor-layout) {
		margin-bottom: 10px;
	}
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
		border-radius: 8px;
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
		padding: 10px 10px 20px 10px !important;
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
