<script>
	// @ts-nocheck
	import { afterUpdate, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { playButton } from '$lib/stores/gamesStore.js';
	import { browser } from '$app/environment';
	// import { fade } from 'svelte/transition';

	export let game;
	export let thumbnail;
	export let user;

	// STORES
	const favoritesStore = writable([]);

	let imageLoaded = false;
	let isFavorited = false;
	let deleteOrCreateFav = false;
	let favorites = [];

	$: themeString = $themeDataStore?.theme?.join(' ');
	$: gameUserID = game?.userId ?? game?.user_id;

	// FUNCTIONS
	const getAllFavoritesSingleGame = async (slug, eventFetch) => {
		const favoritesRes = await eventFetch(`/api/favorites/${slug}/getAllFavoritesSingleGame`);
		const favorites = await favoritesRes.json();

		return favorites;
	};
	onMount(async () => {
		if (browser && game?.id) {
			const favoritesRes = await getAllFavoritesSingleGame(game?.id, fetch);

			if (favoritesRes) {
				// console.log('onMount::favoritesRes::', favoritesRes);
				favoritesStore.set(favoritesRes);
			}
		}
	});
	beforeNavigate(() => {
		isFavorited = false;
	});
	afterUpdate(() => {
		$favoritesStore?.some((fav) => {
			if (fav?.user_id === $session?.id && fav?.game_id === game?.id) {
				isFavorited = true;
			} else {
				isFavorited = false;
			}
		});
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: play = $playButton;

	$: (() => {
		$favoritesStore?.some((fav) => {
			if (fav?.user_id === $session?.id && fav?.game_id === game?.id) {
				isFavorited = true;
			} else {
				isFavorited = false;
			}
		});
	})();
	// $: deleteOrCreateFav = isFavorited ?? false;
	// $: console.log('deleteOrCreateFav::', deleteOrCreateFav);
</script>

<div class="game" style={`${themeString}`}>
	<a href={`/games/${game?.id}/play`}>
		<img
			class="card-thumbnail"
			class:showImage={imageLoaded}
			src={thumbnail ?? 'https://picsum.photos/300/300'}
			on:load={() => {
				imageLoaded = true;
			}}
		/>
		<div class="card-thumbnail-placeholder" class:hidePlaceholder={imageLoaded} />
	</a>
	<div class="card-info">
		<a href={`/games/${game?.id}/play`}>
			<h3>{game?.title}</h3>
			<p>{game?.description}</p>
		</a>
		<div class="card-action-container">
			<div class="btn-flex">
				<Button link={`/games/${game?.id}/play`} label={'Play'} />
				<form
					class="gameDetails new-project-form modal"
					method="POST"
					action="/games/?/{isFavorited ? 'deleteFavorite' : 'createFavorite'}"
					use:enhance={({ formElement, formData, action, cancel, redirect }) => {
						return async ({ result }) => {
							if (result.status === 200) {
								favoritesStore.set(result?.data?.body?.favorites);
								isFavorited = !isFavorited;
								await invalidateAll();
							}
						};
					}}
				>
					<input type="hidden" name="gameId" value={game?.id} />
					<button
						class="action-button button favorites"
						on:click={() => {
							// $actionMenuOpen = !actionOpen;
							setTimeout(() => {
								// $playButton = !play;
								// setTimeout(() => {
								// 	$screenshot = true;
								// }, 200);
							}, 200);
						}}
					>
						<svg
							width="27"
							height="23"
							viewBox="0 0 27 23"
							fill="red"
							xmlns="http://www.w3.org/2000/svg"
							class="fav"
							class:isFavorited={isFavorited && $favoritesStore?.length > 0}
						>
							<path
								d="M26.21 7.25455C26.21 15.4452 14.0656 22.0749 13.5485 22.3487C13.4122 22.422 13.2598 22.4604 13.105 22.4604C12.9502 22.4604 12.7978 22.422 12.6615 22.3487C12.1444 22.0749 0 15.4452 0 7.25455C0.00216787 5.33119 0.767181 3.48723 2.1272 2.1272C3.48723 0.767181 5.33119 0.00216787 7.25455 0C9.67079 0 11.7863 1.03904 13.105 2.79534C14.4237 1.03904 16.5392 0 18.9554 0C20.8788 0.00216787 22.7228 0.767181 24.0828 2.1272C25.4428 3.48723 26.2078 5.33119 26.21 7.25455Z"
								fill="white"
								fill-opacity="0.81"
							/>
						</svg>
						<span class="favorite">{$favoritesStore?.length ?? 0}</span>
					</button>
				</form>
			</div>
			{#if user?.toString() === gameUserID?.toString()}
				<Button link={`/games/${game?.id}/engine`} label={'Edit in Engine'} />
			{/if}
			<!-- <Button link={`/games/${game?.id}/engine`} label={'Open in Engine'} /> -->
		</div>
	</div>
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		border-radius: 6px;
		margin: 0;
		padding: 0 10px;
	}
	.game:hover {
		/* background-color: #333; */
		/* color: white; */
		cursor: pointer;
	}
	.card-thumbnail {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 6px;
		display: none;
	}
	.card-thumbnail.showImage {
		display: block;
	}
	.card-thumbnail-placeholder {
		width: 100%;
		height: 250px;
		border-radius: 6px;
		background-color: var(--folder-button-color);
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		/* border: 2px solid #fbfbfb; */
		border-radius: 6px;
		/* background-color: #fbfbfb; */
		padding: 10px 0 10px 0;
	}
	.card-info p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 5px;
	}
	.card-info a {
		color: var(--color-primary);
		text-decoration: none;
		max-width: 55%;
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 10px;
	}
	.card-info a h3 {
		margin-block-start: 0;
		font-family: var(--header-font);
		font-weight: 400;
		margin-block-end: 0;
	}
	.card-info:hover {
		cursor: pointer;
		/* box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.75); */
	}
	.card-action-container {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		align-items: flex-end;
		gap: 10px;
	}
	.card-thumbnail-placeholder.hidePlaceholder {
		display: none;
	}
	.btn-flex {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		width: 100%;
		gap: 10px;
	}
	svg.isFavorited path {
		fill: red;
	}
	button.action-button.favorites {
		background-color: transparent;
		border-style: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		text-shadow: 0 0 3px var(--color-secondary);
	}

	button.action-button.favorites span {
		color: var(--action-total-text-color);
		font-family: 'Inter', sans-serif;
		font-weight: 500;
	}
</style>
