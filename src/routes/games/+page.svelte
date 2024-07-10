<script>
	// @ts-nocheck

	// Svelte imports
	import { onMount, afterUpdate, onDestroy, tick } from 'svelte';
	import { page } from '$app/stores';

	// Stores
	import { gridWidth, appClientWidth, sideBarState } from '$lib/stores/layoutStore.js';
	import { firstRun } from '$lib/stores/filesStore.js';
	import { gamesData } from '$lib/stores/gamesStore.js';
	import { fetchData } from '$lib/utils/fetchData.js';
	import { homePageInfoStore, modalFullInfoStore } from '$lib/stores/InfoStore.js';

	// 3rd party imports
	import { debounce } from 'lodash-es';

	// Components
	import Card from '$lib/ui/Card/index.svelte';
	import HorizontalList from '$lib/ui/HorizontalList/index.svelte';
	import ActionList from '$lib/ui/ActionList/index.svelte';
	import AccountVerificationNotice from '$lib/ui/AccountVerificationNotice/index.svelte';
	import { browser } from '$app/environment';
	import { platformSession } from '$lib/stores/platformSession/index.js';
	import {
		userPfpStore,
		userBioStore,
		userIdStore,
		userUsernameStore
	} from '$lib/stores/InfoStore.js';
	import { writable } from 'svelte/store';

	// data is a prop passed from the server's load function
	export let data;
	let gamesList = [];
	let updating = false;
	let games = writable([]);
	let totalGames = parseInt(data?.total, 10);
	let limit = 10;
	let offset = data.games.length;
	let loading = false;
	let observer;
	let initialized = false;
	let EOL;

	const setupObserver = () => {
		if (initialized) {
			return;
		}
		initialized = true;
		observer = new IntersectionObserver(observe, {
			root: null,
			rootMargin: '0px',
			threshold: 0.1 // Adjust threshold value here if needed
		});

		if (EOL) {
			try {
				observer.observe(EOL);
			} catch (error) {
				console.log('setupObserver::error::observing::end-of-list::', error);
			}
		} else {
			console.error('setupObserver::#end-of-list element not found during setup');
		}
	};

	const loadMoreGames = async () => {
		if (loading || offset >= totalGames) {
			return;
		}
		loading = true;
		try {
			const response = await fetch(`/api/games/paginated?limit=${limit}&offset=${offset}`);
			const result = await response.json();
			games.update((current) => [...current, ...result.games]);
			offset += limit;
		} catch (error) {
			console.error('loadMoreGames::error loading more games', error);
		} finally {
			loading = false;
		}
	};

	const observe = (entries, observer) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				loadMoreGames();
			}
		}
	};

	const reobserveEndOfList = () => {
		if (EOL) {
			observer.unobserve(EOL); // Stop observing the current end-of-list
			observer.observe(EOL); // Re-observe the new end-of-list
		} else {
			console.error('reobserveEndOfList::#end-of-list element not found during reobserve');
		}
	};

	onMount(async () => {
		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (!$userUsernameStore || !$userIdStore) {
			userIdStore.set(data?.userId);
			userUsernameStore.set(data?.username);
		}

		games.set(data.games);

		if ($games?.length > 0 && EOL) {
			setupObserver();
		}
	});

	afterUpdate(async () => {
		await tick();
		if (initialized) {
			reobserveEndOfList();
		} else {
			if ($games?.length > 0 && EOL) {
				setupObserver();
			}
		}
	});

	onDestroy(() => {
		gamesList = [];

		if (observer) {
			observer.disconnect();
		}
	});

	$: isMobile = $appClientWidth < 768;
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
	$: currentUserId = $platformSession?.currentUser?.id;
	$: isProfilePage =
		splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main');
	$: isBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' ||
		(splitPath[1] === 'users' && !isProfilePage && !splitPath.some((path) => path === 'users'));
	$: isUserGamesBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users';

	$: hasGames = $games?.length > 0;
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
	{#if !data?.isActive && $platformSession?.currentUser?.id}
		<AccountVerificationNotice />
	{/if}
	<ActionList />
	<HorizontalList title="Categories" subtitle="Browse by Category" type={'categories'} />
	<h3 class="grid-header">{'All Games'}</h3>
	<h4 class="grid-header">{'Browse all published games'}</h4>
	<div
		class="main grid"
		bind:clientWidth={$gridWidth}
		class:isMobile
		class:showSideBar={$sideBarState}
	>
		{#if $games?.length === 0}
			<p>No games found</p>
		{:else}
			{#each $games as game, i (`game_${game?.id}_${i}`)}
				<Card id={game?.id} {game} thumbnail={game?.thumbnail} />
			{/each}
		{/if}
	</div>
	{#if hasGames}
		<div id="end-of-list" style="height: 20px;" bind:this={EOL}>
			{loading || offset < totalGames ? 'Loading more...' : 'End of list!'}
		</div>
	{/if}
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
	}
	.main.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin: 0;
		height: fit-content;
		padding: 10px 20px 20px 20px;
		border-radius: 8px;
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
	#end-of-list {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		text-align: center;
		padding-bottom: 50px;
	}
</style>
