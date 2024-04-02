<script>
	// @ts-nocheck

	// Svelte imports
	import { onMount, afterUpdate } from 'svelte';
	import { page } from '$app/stores';

	// Stores
	import { gridWidth, appClientWidth, sideBarState } from '$lib/stores/layoutStore.js';
	import { session } from '$lib/stores/sessionStore.js';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { gamesData } from '$lib/stores/gamesStore.js';
	import { fetchData } from '$lib/utils/fetchData.js';

	// 3rd party imports
	import { debounce } from 'lodash-es';

	// Components
	import Card from '$lib/ui/Card/index.svelte';
	import HorizontalList from '$lib/ui/HorizontalList/index.svelte';
	import ActionList from '$lib/ui/ActionList/index.svelte';

	// data is a prop passed from the server's load function
	export let data;

	const handleScroll = async (e) => {
		scrolling = true;
		const threshold = scrollableElement.scrollHeight - (scrollableElement.scrollTop + 100);
		const target = scrollableElement?.clientHeight + 400;

		if (target >= threshold) {
			await runFetch();
			// console.log('threshold met... fetching more games...');
		}
	};
	const runFetch = async () => {
		const newGames = await fetchData(fetch, `/api/games/getAllGames/${nextCursor}`);
		nextCursor = newGames?.nextCursor;
		fetchMoreGames = [...fetchMoreGames, ...(newGames?.games ?? null)];
	};
	onMount(async () => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (data?.games) {
			gamesData.set([...data?.games]);
		}

		window.addEventListener('scroll', handleScroll);

		if ([...parsedGamesDataSet].length === 0) {
			await runFetch();
		}

		// Initial fetch with no cursor
		return () => {
			// Cleanup the event listener when the component is destroyed
			window.removeEventListener('scroll', handleScroll);
		};
	});
	afterUpdate(async () => {
		if (data?.user?.id) {
			session.set(data?.user);
		}
	});

	const debouncedHandleScroll = debounce(handleScroll, 50);
	let dataGames = [];
	let fetchMoreGames = [];
	let nextCursor = 0;
	let scrolling = false;
	let scrollableElement;

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
	$: dataGames = [...dataGames, ...data?.games, ...fetchMoreGames];
	$: gamesSet = new Set(dataGames.map((game) => game));
	$: gamesData.set([...gamesSet].filter((game) => game?.id));
	$: parsedGamesData = [...$gamesData];
	$: parsedGamesDataSet = new Set(parsedGamesData.map((game) => game));
	$: copiedParsedGamesDataSet = [...parsedGamesDataSet];
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
	<ActionList />
	<HorizontalList title="Categories" subtitle="Browse by Category" type={'categories'} />
	<h3 class="grid-header">{'All Games'}</h3>
	<h4 class="grid-header">{'Browse all published games'}</h4>
	<div
		class="main grid"
		bind:clientWidth={$gridWidth}
		class:isMobile
		class:showSideBar={$sideBarState}
		on:scroll={debouncedHandleScroll}
		on:scrollend={() => (scrolling = false)}
		bind:this={scrollableElement}
	>
		{#if copiedParsedGamesDataSet?.length > 0}
			{#each copiedParsedGamesDataSet as game, i (`game_${game?.id}_${i}`)}
				<Card id={game?.id} {game} thumbnail={game?.thumbnail} />
			{/each}
		{/if}
	</div>
</div>

<style>
	h3.grid-header {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-primary);
		margin-block-start: 40px;
		margin-block-end: 0;
		align-self: flex-start;
		padding-left: 10px;
	}

	h4.grid-header {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
		margin-block-start: 0;
		margin-block-end: 0;
		align-self: flex-start;
		padding-left: 10px;
	}
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow-y: scroll !important;
		overflow-x: hidden;
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
		gap: 20px;
		margin: 0;
		height: fit-content;
		padding: 10px 20px 20px 20px;
	}
	:global(#editor-layout) div.main.grid.isMobile {
		white-space: nowrap;
		/* overflow: hidden; */
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
