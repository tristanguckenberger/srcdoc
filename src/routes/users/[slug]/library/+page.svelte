<script>
	// @ts-nocheck
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';
	import HorizontalList from '$lib/ui/HorizontalList/index.svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { platformSession } from '$lib/stores/platformSession/index.js';
	import AccountVerificationNotice from '$lib/ui/AccountVerificationNotice/index.svelte';

	export let data;

	let componentOptions = [];

	setContext('playlistContext', {
		mousedOverItemId: writable(null),
		showPlayButtonStore: writable(false)
	});

	$: (() => {
		return (componentOptions = [
			{
				name: 'NewPlaylist',
				props: {
					name: 'New Playlist',
					description: 'New Playlist Description',
					isPublic: false,
					fromLayout: true
				},
				component: EditPlaylistDetails
			}
		]);
	})();
</script>

<div class="playlist-drawer-container">
	{#if data}
		<div class="playlists-container" class:sideBarOpen={$sideBarState}>
			{#if !$platformSession?.currentUser?.is_active}
				<AccountVerificationNotice />
			{/if}
			{#if $platformSession?.currentUser?.id}
				<HorizontalList
					title="Favorites"
					subtitle="Your Favorites"
					type={'favorites'}
					link={'/games/favorites'}
					userId={$platformSession?.currentUser?.id}
				/>
				<HorizontalList
					title="Projects"
					subtitle="Your Projects"
					type={'projects'}
					userId={$platformSession?.currentUser?.id}
					link={`/users/${$platformSession?.currentUser?.id}/games`}
				/>
			{/if}
			<h3>Playlists</h3>
			<h4>Your Playlists</h4>
			<div class="playlist-container">
				{#each data.playlists as playlist}
					<div class="single-playlist-container">
						<PlaylistCard id={playlist.id} {playlist} thumbnail={playlist?.thumbnail} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget content={data} options={componentOptions} />
		</div>
	</Drawer>
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
	}
	.playlists-container.sideBarOpen {
		width: calc(100%);
	}
	:global(#editor-layout) {
		overflow-y: scroll;
		overflow-x: hidden;
		padding-bottom: 20px;
	}
	:global(#editor-layout.playInRoute) {
		padding-bottom: 0;
	}
	h3,
	h4 {
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		margin-block-end: 0;
		color: var(--color-primary);
		padding-left: 10px;
	}
	h3 {
		font-size: 1.5rem;

		margin-block-start: 40px;
	}

	h4 {
		font-size: 1rem;
		margin-block-start: 10px;
		margin-block-end: 10px;
	}
	.playlist-container :global(.playlist .card-info p) {
		white-space: pre;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
		width: 200px;
	}
</style>
