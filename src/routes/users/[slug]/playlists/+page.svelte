<script>
	// @ts-nocheck
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';

	export let data;

	let ComponentOptions = [];

	afterNavigate((nav) => {
		// sideBarState.set(false);
	});

	$: (() => {
		return (ComponentOptions = [
			{
				name: 'NewPlaylist',
				props: {
					name: '',
					description: '',
					isPublic: true
				},
				component: EditPlaylistDetails
			}
		]);
	})();
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
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget id={'inLayout'} content={[]} options={ComponentOptions} />
		</div>
	</Drawer>
</div>

<style>
	.single-playlist-container {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		/* margin: 0; */
		padding: 0 10px;
		/* background: #32323229; */
		transition: background 0.2s linear(0.07 -1.12%, 1 100%);
	}
	.single-playlist-container h2 {
		font-size: 1.5rem;
		color: var(--color-primary);
	}
	.single-playlist-container p {
		font-size: 1rem;
		color: var(--color-primary);
	}
	.single-playlist-container span {
		font-size: 0.8rem;
		font-family: var(--header-font), sans-serif;
		font-weight: 400;
		color: var(--color-primary);
	}
	.single-playlist-container h3 {
		font-size: 1rem;
		color: var(--color-primary);
		position: relative;
		bottom: 3px;
	}
	.info-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
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
