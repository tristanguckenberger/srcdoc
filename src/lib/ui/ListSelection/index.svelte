<script>
	// @ts-nocheck
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { browser } from '$app/environment';
	import { playlistSelectionStore } from '$lib/stores/playlistSelectionStore.js';
	import { add } from 'lodash-es';

	export let playlist;
	export let id;
	export let thumbnail;
	export let currentGameId;

	let checked = false;
	let imageLoaded = false;
	let cardImage;
	let showMoreInfo = false;

	// This handles the selection of the game
	const handleSelectionToggle = async (playlistId) => {
		let initialStoreValue;
		let addGame = false;
		let removeGame = false;
		playlistSelectionStore.update(() => {
			// find where the id is equal to the playlistId and update the checked value
			const index = $playlistSelectionStore.findIndex((playlist) => {
				return playlist.id === playlistId;
			});

			// if the index is not found, meaning the playlistId is not in the store, lets add it
			if (index === -1) {
				$playlistSelectionStore = [...$playlistSelectionStore, { id: playlistId, checked: true }];
				return $playlistSelectionStore;
			}

			initialStoreValue = JSON.parse(JSON.stringify($playlistSelectionStore[index]));
			$playlistSelectionStore[index].checked = !$playlistSelectionStore[index].checked;

			if ($playlistSelectionStore[index].checked !== initialStoreValue?.checked) {
				addGame = Boolean($playlistSelectionStore[index].checked);
				removeGame = !Boolean($playlistSelectionStore[index].checked);
			}

			return $playlistSelectionStore;
		});

		if (removeGame) {
			const removedGame = await fetch(`/api/playlist/${playlistId}/removeGame`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					gameId: currentGameId
				})
			});
			removeGame = false;
			await invalidateAll();
		} else if (addGame) {
			const addedGame = await fetch(`/api/playlist/${playlistId}/addGame`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					gameId: currentGameId
				})
			});
			addGame = false;
			await invalidateAll();
		} else {
			addGame = false;
			removeGame = false;
		}
	};

	afterUpdate(() => {
		if (cardImage) {
			imageLoaded = true;
		}
	});

	onDestroy(() => {
		user = null;
		playlist = null;
		id = null;
		currentGameId = null;
		thumbnail = null;
		imageLoaded = false;
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: cardLink = `/games/${id}/play`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: user = $session;
	$: loadedThumbnail = thumbnail ?? 'https://picsum.photos/300/300';

	// get the checked value from the store
	// $: checked = $playlistSelectionStore?.filter((playlistId) => playlistId === id)?.[0]?.checked;
	$: checkedStoreValue = $playlistSelectionStore?.find((playlist) => {
		return playlist.id === id;
	});

	$: checked = checkedStoreValue?.checked;
</script>

{#await (playlist, id, thumbnail, user)}
	Loading...
{:then}
	<div
		class="playlist"
		style={`${themeString}`}
		on:mouseenter={() => (showMoreInfo = true)}
		on:mouseleave={() => (showMoreInfo = false)}
		on:focus={() => {
			// console.log('focused');
		}}
		on:click={() => handleSelectionToggle(id)}
		aria-roledescription="playlist"
		role="button"
		tabindex="0"
	>
		{#if thumbnail}
			<div class="linked-card-container">
				<img
					bind:this={cardImage}
					class="card-thumbnail"
					class:showImage={imageLoaded}
					src={loadedThumbnail ?? playlist?.thumbnail}
					alt={playlist?.name}
				/>

				<div class="card-thumbnail-placeholder" class:hidePlaceholder={imageLoaded} />
			</div>
		{/if}
		<div class="card-info">
			<div>
				<h4>{playlist?.name}</h4>
				<p>{playlist?.description}</p>
			</div>

			{#if checked}
				<svg
					width="26"
					height="26"
					viewBox="0 0 26 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM18.7075 10.7075L11.7075 17.7075C11.6146 17.8005 11.5043 17.8742 11.3829 17.9246C11.2615 17.9749 11.1314 18.0008 11 18.0008C10.8686 18.0008 10.7385 17.9749 10.6171 17.9246C10.4957 17.8742 10.3854 17.8005 10.2925 17.7075L7.29251 14.7075C7.10486 14.5199 6.99945 14.2654 6.99945 14C6.99945 13.7346 7.10486 13.4801 7.29251 13.2925C7.48015 13.1049 7.73464 12.9994 8.00001 12.9994C8.26537 12.9994 8.51987 13.1049 8.70751 13.2925L11 15.5863L17.2925 9.2925C17.3854 9.19959 17.4957 9.12589 17.6171 9.07561C17.7385 9.02532 17.8686 8.99944 18 8.99944C18.1314 8.99944 18.2615 9.02532 18.3829 9.07561C18.5043 9.12589 18.6146 9.19959 18.7075 9.2925C18.8004 9.38541 18.8741 9.49571 18.9244 9.6171C18.9747 9.7385 19.0006 9.86861 19.0006 10C19.0006 10.1314 18.9747 10.2615 18.9244 10.3829C18.8741 10.5043 18.8004 10.6146 18.7075 10.7075Z"
						fill="black"
					/>
				</svg>
			{:else}
				<svg
					width="26"
					height="26"
					viewBox="0 0 26 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M26 13C26 15.5712 25.2376 18.0846 23.8091 20.2224C22.3807 22.3603 20.3503 24.0265 17.9749 25.0104C15.5995 25.9944 12.9856 26.2518 10.4638 25.7502C7.94208 25.2486 5.6257 24.0105 3.80762 22.1924C1.98953 20.3743 0.751405 18.0579 0.249797 15.5362C-0.251811 13.0144 0.0056327 10.4006 0.989572 8.02512C1.97351 5.64968 3.63975 3.61935 5.77759 2.1909C7.91543 0.762437 10.4288 0 13 0C16.4467 0.00363977 19.7512 1.37445 22.1884 3.81163C24.6256 6.24882 25.9964 9.5533 26 13ZM24 13C24 10.8244 23.3549 8.69767 22.1462 6.88873C20.9375 5.07979 19.2195 3.66989 17.2095 2.83733C15.1995 2.00476 12.9878 1.78692 10.854 2.21136C8.72022 2.6358 6.76021 3.68345 5.22183 5.22183C3.68345 6.7602 2.63581 8.72022 2.21137 10.854C1.78693 12.9878 2.00477 15.1995 2.83733 17.2095C3.66989 19.2195 5.07979 20.9375 6.88873 22.1462C8.69767 23.3549 10.8244 24 13 24C15.9164 23.9967 18.7123 22.8367 20.7745 20.7745C22.8367 18.7123 23.9967 15.9164 24 13Z"
						fill="black"
					/>
				</svg>
			{/if}
		</div>
	</div>
{/await}

<style>
	.playlist {
		display: flex;
		flex-direction: row;
		width: calc(100% - 20px);
		height: 50px;
		border-radius: 6px;
		margin: 0;
		padding: 10px;
		/* background: #32323229; */
		transition: background 0.09s linear(0.07 -1.12%, 1 100%);
	}
	.playlist:hover {
		cursor: pointer;
		background: var(--home-gradient-color-1);
	}
	.card-thumbnail {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
		transition: opacity 0.03s;
		opacity: 0;
		min-width: 50px;
	}
	.card-thumbnail.showImage {
		opacity: 1;
	}
	.card-thumbnail-placeholder {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		background-color: var(--folder-button-color);
		opacity: 1;
		position: absolute;
		top: 0;
		transition: opacity 0.03s;
		min-width: 50px;
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		border-radius: 6px;
		flex-grow: 1;
	}
	.card-info p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
		max-width: 250px;
	}
	.card-info div {
		color: var(--color-primary);
		text-decoration: none;
		/* max-width: 55%; */
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 5px;
		padding: 0 0 0 10px;
		width: 100%;
	}
	.card-info div h4 {
		margin-block-start: 0;
		font-family: 'Inter';
		font-weight: 450;
		margin-block-end: 0;
		font-size: 1rem;
		text-overflow: ellipsis;
		max-block-size: fit-content;
	}
	.card-info:hover {
		cursor: pointer;
	}
	.card-thumbnail-placeholder.hidePlaceholder {
		opacity: 0;
	}
	.linked-card-container {
		position: relative;
	}
	.more-actions {
		align-self: center;
		align-items: center;
		justify-content: center;
		position: relative;
		bottom: 7px;
		font-size: 2rem;
		display: none;
	}
	.more-actions.show {
		display: flex;
	}
	.card-info svg {
		align-self: center;
	}
	.card-info svg path {
		fill: var(--color-primary);
	}
</style>
