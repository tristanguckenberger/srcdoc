<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
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
	import { screenshot } from '$lib/stores/gamesStore';
	import { platformSession } from '$lib/stores/platformSession';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	export let game;
	export let id;
	export let thumbnail;

	// STORES
	const favoritesStore = writable([]);

	let imageLoaded = false;
	let isFavorited = false;
	let deleteOrCreateFav = false;
	let favorites = [];
	let cardImage;
	let showMoreInfo = false;

	// FUNCTIONS
	const getAllFavoritesSingleGame = async (slug, eventFetch) => {
		const favoritesRes = await eventFetch(`/api/favorites/${slug}/getAllFavoritesSingleGame`);
		const favorites = await favoritesRes.json();

		return favorites;
	};

	onMount(async () => {
		if (browser && id && !game?.favorites) {
			const favoritesRes = await getAllFavoritesSingleGame(id, fetch);

			if (favoritesRes) {
				favoritesStore.set(favoritesRes);
			}
		}

		if (game?.favorites) {
			favorites = game?.favorites;
			favoritesStore.set(favorites);
		}
	});

	beforeNavigate(() => {
		isFavorited = false;
	});

	afterUpdate(() => {
		if (cardImage) {
			imageLoaded = true;
		}

		isFavorited = $favoritesStore?.some((fav) => {
			return (
				fav?.user_id?.toString() === $platformSession?.currentUser?.id?.toString() &&
				fav?.game_id?.toString() === id?.toString()
			);
		});
	});

	onDestroy(() => {
		user = null;
		game = null;
		id = null;
		thumbnail = null;
		imageLoaded = false;
		isFavorited = false;
		deleteOrCreateFav = false;
		favorites = [];
	});

	// REACTIVE VARIABLES & STATEMENTS
	$: cardLink = `/games/${id}/play`;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: gameUserID = game?.user_id;
	$: user = $platformSession?.currentUser;
	$: loadedThumbnail = thumbnail ?? 'https://picsum.photos/300/300';
</script>

{#await (game, id, thumbnail, user)}
	Loading...
{:then}
	<div
		class="game"
		style={`${themeString}`}
		on:mouseover={() => (showMoreInfo = !showMoreInfo)}
		on:focus={() => {}}
		aria-roledescription="game"
		role="button"
		tabindex="0"
	>
		<a href={cardLink} class="linked-card-container">
			{#if game?.thumbnail}
				<img
					bind:this={cardImage}
					class="card-thumbnail"
					class:showImage={imageLoaded}
					src={game?.thumbnail}
					alt={game?.title}
				/>
			{:else}
				<div
					class="card-thumbnail-placeholder card-thumbnail"
					class:hidePlaceholder={thumbnail || game?.thumbnail}
				>
					<ImagePlaceHolder />
				</div>
			{/if}
		</a>
		<div class="card-info">
			<a href={`/games/${id}/play`}>
				<h4>{game?.title}</h4>
				<p>{game?.description}</p>
			</a>
			<div class="card-action-container">
				<div class="btn-flex">
					<Button link={`/games/${id}/play`} label={'Play'} />
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
						<input type="hidden" name="gameId" value={id} />
						<button
							class="action-button button favorites"
							on:click={() => {
								setTimeout(() => {
									$screenshot = true;
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
				{#if $platformSession?.currentUser?.id?.toString() === game?.user_id?.toString()}
					<Button link={`/games/${id}/engine`} label={'Edit in Engine'} />
				{/if}
			</div>
		</div>
	</div>
{/await}

<style>
	.game {
		display: flex;
		flex-direction: column;
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		border-radius: 6px;
		margin: 0;
		padding: 10px;
		background: #2f3134;
		transition: background 0.2s linear(0.07 -1.12%, 1 100%);
		height: fit-content;
	}
	.game:hover {
		cursor: pointer;
		background: var(--home-gradient-color-1);
	}
	.card-thumbnail {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 6px;
		transition: opacity 0.03s;
		opacity: 0;
	}
	.card-thumbnail.showImage {
		opacity: 1;
	}
	.card-thumbnail-placeholder {
		background-color: var(--folder-button-color);
		opacity: 1;
		margin-bottom: 10px;
		overflow: hidden;
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		border-radius: 6px;
		padding: 10px 0 10px 0;
	}
	.card-info p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
	}
	.card-info a {
		color: var(--color-primary);
		text-decoration: none;
		max-width: 55%;
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 10px;
		padding: 0 0 0 10px;
	}
	.card-info a h4 {
		margin-block-start: 0;
		font-family: 'Inter';
		font-weight: 600;
		margin-block-end: 0;
		font-size: 1.17rem;
		word-wrap: break-word;
		max-block-size: fit-content;
	}
	.card-info:hover {
		cursor: pointer;
	}
	.card-action-container {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		align-items: flex-end;
		gap: 10px;
	}
	.card-thumbnail-placeholder.hidePlaceholder {
		opacity: 0;
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
	.linked-card-container {
		position: relative;
	}
	.favorites:hover {
		cursor: pointer;
	}
	/* .card-thumbnail-overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
	} */
</style>
