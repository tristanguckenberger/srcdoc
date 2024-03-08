<script>
	// @ts-nocheck
	import GameCard from '$lib/ui/GameCard/index.svelte';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { sideBarState } from '$lib/stores/layoutStore';
	import { beforeNavigate } from '$app/navigation';
	import { searchResultsStore, searchHasResultsStore } from '$lib/stores/search/searchStore';
	// import Comments from '../Widget/Components/Comments.svelte';
	// import CommentCard from '$lib/ui/CommentCard/index.svelte';
	// import UserCard from '$lib/ui/UserCard/index.svelte';

	export let searchResults;

	$: themeString = $themeDataStore?.theme?.join(' ');

	beforeNavigate(() => {
		searchResultsStore.set([]);
	});
</script>

<div class="search-result-container" style={themeString} class:showSideBar={$sideBarState}>
	{#if searchResults}
		{#each searchResults as result}
			{#if result.type === 'games'}
				<GameCard id={result.id} game={result} thumbnail={result.thumbnail} />
			{:else if result.type === 'playlist'}
				<PlaylistCard id={result.id} playlist={result} thumbnail={result.thumbnail} />
			{:else if result.type === 'comments'}
				<!-- <Comments {result} /> -->
			{:else if result.type === 'users'}
				<!-- <UserCard {result} /> -->
			{/if}
		{/each}
	{/if}
</div>

<style>
	.search-result-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		position: absolute;
		z-index: 100000;
		width: 100%;
		height: 100%;
		left: 0;
		top: 57px;
		background-color: var(--text-box);
		padding: 10px;
	}
	.search-result-container.showSideBar {
		width: calc(100% - 230px);
		left: 230px;
	}
	.search-result-container :global(.playlist) {
		width: calc(100% - 40px);
	}
</style>
