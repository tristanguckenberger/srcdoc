<script>
	// @ts-nocheck
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';

	export let data;
</script>

<h2 class="title">My Library</h2>

<div class="playlist-drawer-container">
	{#if data}
		<div class="playlists-container" class:sideBarOpen={$sideBarState}>
			{#each data.playlists as playlist}
				<div class="single-playlist-container">
					<PlaylistCard id={playlist.id} {playlist} />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.single-playlist-container {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		padding: 0 10px;
		transition: background 0.2s linear(0.07 -1.12%, 1 100%);
	}
	.playlists-container {
		display: flex;
		flex-direction: column;
		/* gap: 10px; */
	}
	.title {
		color: var(--color-primary);
		margin-inline-start: 20px;
		font-family: var(--header-font), sans-serif;
	}
	.playlists-container.sideBarOpen {
		width: calc(100% - 230px);
	}
</style>
