<script>
	// @ts-nocheck
	import List from '$lib/ui/List/index.svelte';
	import { onMount } from 'svelte';

	export let gameId;

	let leaderboardRes;

	onMount(async () => {
		leaderboardRes = await fetch(`/api/games/${gameId}/leaderboards`);
	});
</script>

<h2>High Scores</h2>
{#if leaderboardRes}
	{#await leaderboardRes.json()}
		<p>Loading rows...</p>
	{:then leaderboardRows}
		{#if leaderboardRows}
			<List {gameId} listContent={leaderboardRows} />
		{:else}
			<p>No leaderboard data available</p>
		{/if}
	{/await}
{:else}
	<p>No leaderboard data available</p>
{/if}

<style>
	h2 {
		color: var(--text-color-primary);
		font-family: var(--header-font);
		font-size: 1.5rem;
		margin-block-start: 0;
		font-weight: 900;
		position: absolute;
		top: -26px;
	}
</style>
