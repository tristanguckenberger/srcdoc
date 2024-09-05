<script>
	// @ts-nocheck
	import Card from '$lib/ui/Card/index.svelte';
	import { gridWidth } from '$lib/stores/layoutStore.js';
	import { afterUpdate, onMount, tick } from 'svelte';
	import { sideBarState, sideBarWidth, appClientWidth } from '$lib/stores/layoutStore.js';
	import { page } from '$app/stores';
	import { gamesData } from '$lib/stores/gamesStore.js';
	import AccountVerificationNotice from '$lib/ui/AccountVerificationNotice/index.svelte';
	import { platformSession } from '$lib/stores/platformSession/index.js';

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
	$: isMobile = $appClientWidth < 768;
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
</script>

<div
	class="game-page-container"
	class:noSideBar={!engineInRoute}
	class:expandSideNav={$sideBarState}
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
		{#each data?.games as game, i (`game_${game?.id}_${i}`)}
			<Card id={game?.id} {game} thumbnail={game?.thumbnail} />
		{/each}
	</div>
</div>

<style scoped>
	:global(#editor-layout) {
		margin-bottom: 10px;
		padding-bottom: 0 !important;
	}
	:global(#editor-layout) div.main.grid {
		width: 100% !important;
	}
	.game-page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
		border-radius: 8px;
	}
	.game-page-container.expandSideNav {
		/* width: calc(100% - 230px); */
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
		/* padding: 10px 20px 20px 20px; */
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
	@media (max-width: 498px) {
		:global(#editor-layout) {
			display: flex;
			flex-direction: column;
			height: calc(100% + 10px);
			width: calc(100% - 20px);
			margin-left: 10px;
			background-color: var(--color-secondary);
			background: var(--home-gradient-color-2);
			background: linear-gradient(
				270deg,
				var(--home-gradient-color-1) 0%,
				var(--home-gradient-color-2) 100%
			);
			background: -moz-linear-gradient(
				270deg,
				var(--home-gradient-color-1) 0%,
				var(--home-gradient-color-2) 100%
			);
			background: -webkit-linear-gradient(
				270deg,
				var(--theme-or-highlight) 0%,
				var(--home-gradient-color-2) 100%
			);
			border-radius: 8px;
			transition: background 0.09s linear(0.07 -1.12%, 1 100%);
			height: unset !important;
		}

		.main.grid {
			width: calc(100% - 0px);
		}
	}
</style>
