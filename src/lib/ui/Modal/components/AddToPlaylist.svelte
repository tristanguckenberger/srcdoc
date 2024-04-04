<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { modalProps, modalState, modalOpenState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { drawerOpen } from '$lib/stores/drawerStore';
	import { currentGame } from '$lib/stores/gamesStore';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';
	import ListSelection from '$lib/ui/ListSelection/index.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { playlistSelectionStore } from '$lib/stores/playlistSelectionStore';

	export let gameId;
	export let action = ''; //'?/createPlaylist';
	export let fromLayout = false;

	let label = 'Done';
	let allUserOwnedPlaylists = [];

	const getAllGamesForPlaylist = async (eventFetch, playlistId) => {
		const playlistRes = await eventFetch(`/api/playlist/${playlistId}/games`);
		const games = await playlistRes.json();
		return games;
	};

	const getAllPlaylistsByUser = async (eventFetch) => {
		const playlistRes = await eventFetch(`/api/playlist/myLibrary`);
		const playlists = await playlistRes.json();

		// get the games in the playlists
		const playlistsWithGames = await Promise.all(
			playlists?.map(async (playlist) => {
				let games = await getAllGamesForPlaylist(eventFetch, playlist.id);
				const playlistAndGames = { ...(await games) };

				return playlistAndGames;
			})
		);

		return playlistsWithGames;
	};

	const getGameInPlaylists = async (eventFetch) => {
		const playlistRes = await eventFetch(`/api/playlist/game/${gameId}`);
		const playlists = await playlistRes.json();
		return playlists;
	};

	onMount(async () => {
		// fetch all of a users OWNED playlists
		getAllPlaylistsByUser(fetch).then((playlists) => {
			allUserOwnedPlaylists = playlists;

			// Add all playlists to the playlistSelectionStore initially
			playlistSelectionStore.set(
				playlists.map((playlist) => ({ id: playlist.id, checked: false }))
			);

			// Check if the gameId is in any of the playlist's games (playlist.games.includes(gameId))
			// Update the store checked values accordingly
			playlists.forEach((playlist) => {
				playlist.games.forEach((game) => {
					if (game?.id === gameId) {
						playlistSelectionStore.update((store) => {
							return store.map((item) => {
								if (item.id === playlist.id) {
									return { ...item, checked: true };
								}
								return item;
							});
						});
					}
				});
			});
		});
	});

	onDestroy(() => {
		allUserOwnedPlaylists = [];
		playlistSelectionStore.set([]);
	});
</script>

<div class="gameDetails new-project-form modal">
	{#each allUserOwnedPlaylists as playlist}
		<ListSelection
			{playlist}
			id={playlist?.id}
			thumbnail={playlist?.thumbnail}
			currentGameId={gameId}
		/>
	{/each}
	<!-- <CustomInput inputCapture={'isPublic'} inputValue={isPublic} hidden />
	<ToggleSwitch bind:value={isPublic} label="Public" design="slider" />
	<CustomInput inputCapture={'name'} inputText={name}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'} inputText={description}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput> -->
	<button on:click={() => ($drawerOpen = false)}>Done</button>
</div>

<style>
	div.gameDetails {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 50vh;
	}

	div.gameDetails :global(button) {
		background-color: var(--button-highlight);
		color: var(--color-primary) !important;
	}

	div.gameDetails :global(button:hover) {
		background-color: var(--button-highlight);
		/* background-color: #283e5e !important; */
	}
	button {
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 30px;
		padding: 10px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		justify-content: center;
		align-items: center;
		max-height: 36.5px;
		font-weight: 500;
	}
	button:hover {
		color: var(--text-color-highlight);
		cursor: pointer;
		background-color: var(--button-highlight) !important;
		transition: background-color 250ms ease;
	}
</style>
