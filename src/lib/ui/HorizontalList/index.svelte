<script>
	// @ts-nocheck
	/** Horizontal List - A component to display Horizontal List of content * preferably playlists,
	games, or users * * @prop {Array} items - An array of items to display * @prop {String} type - The type
	of items to display * @prop {String} title - The title of the list * @prop {String} subtitle - The subtitle
	of the list * @prop {String} link - The link to the full list grid */
	import { onMount } from 'svelte';
	import HorizontalListCard from '$lib/ui/HorizontalListCard/index.svelte';
	import { platformSession } from '$lib/stores/platformSession';

	/**
	 * @typedef {Object} Props
	 * @property {any} [items]
	 * @property {string} [type]
	 * @property {string} [title]
	 * @property {string} [subtitle]
	 * @property {string} [link]
	 * @property {string} [userId]
	 * @property {number} [limit]
	 * @property {boolean} [showViewMore]
	 * @property {string} [viewMoreLabel]
	 */

	/** @type {Props} */
	let {
		items = $bindable([]),
		type = '',
		title = '',
		subtitle = '',
		link = '',
		userId = '',
		limit = 10,
		showViewMore = $bindable(false),
		viewMoreLabel = 'View More'
	} = $props();

	const getAllCategories = async () => {
		const response = await fetch('/api/categories/static/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		if (data?.categories?.length > limit) {
			showViewMore = true;
		}
		items = [...data?.categories?.slice(0, limit)];
	};

	const getMyProjects = async () => {
		if ($platformSession?.currentUser?.id === userId && !$platformSession?.currentUser?.is_active) {
			return;
		}
		const gamesRes = await fetch(`/api/games/getAllGamesByUser/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const games = await gamesRes.json();
		const publishedGames = games?.filter((game) => game?.published);

		if (publishedGames?.length > limit) {
			showViewMore = true;
		}

		items = [...publishedGames.slice(0, limit)];
	};

	const getMyFavorites = async () => {
		if ($platformSession?.currentUser?.id === userId && !$platformSession?.currentUser?.is_active) {
			return;
		}
		const gamesRes = await fetch(`/api/favorites/byUser/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const games = await gamesRes.json();
		const publishedGames = games?.filter((game) => game?.published);

		if (publishedGames?.length > limit) {
			showViewMore = true;
		}

		items = [...publishedGames?.slice(0, limit)];
	};

	onMount(() => {
		// fetch our playlist categories
		if (type === 'categories') {
			getAllCategories();
		} else if (type === 'projects') {
			getMyProjects();
		} else if (type === 'favorites') {
			getMyFavorites();
		}
	});
</script>

<div class="horizontal-list">
	<h3>{title}</h3>
	<div class="info-action">
		<h4>{subtitle}</h4>
		{#if showViewMore}
			<a href={link}>
				<h5>{viewMoreLabel}</h5>
			</a>
		{/if}
	</div>

	<div class="list-container">
		{#if items.length === 0}
			<h4>No items found</h4>
		{:else}
			{#each items as item}
				<div class="list-item">
					<HorizontalListCard
						id={item?.id}
						title={item?.name ?? item?.title}
						subtitle={item?.description}
						thumbnail={item?.thumbnail}
						cardLink={type === 'categories' ? `/playlists/${item?.id}` : `/games/${item?.id}/play`}
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.horizontal-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: fit-content;
		margin-block-end: 20px;
		margin-inline-start: 10px;
		max-width: calc(100% - 20px);
		align-self: flex-start;
	}

	.horizontal-list h3 {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-primary);
		margin-block-start: 40px;
		margin-block-end: 0;
	}

	.horizontal-list h4 {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.horizontal-list a {
		text-decoration: none;
	}

	.horizontal-list a:hover {
		text-decoration: underline;
		text-decoration-color: #4e7a95;
	}

	.horizontal-list a h5 {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 500;
		color: #4e7a95;
		margin-block-start: 0;
		margin-block-end: 0;
		padding-right: 10px;
	}

	.horizontal-list .list-container {
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		gap: 10px;
	}

	.horizontal-list .list-container::-webkit-scrollbar {
		display: none;
	}

	.horizontal-list .list-container .list-item {
		flex: 0 0 auto;
		background: var(--list-item-bg-default);
		border-radius: 6px;
		transition: none !important;
	}

	.horizontal-list .list-container .list-item:hover {
		cursor: pointer;
		background-color: var(--list-item-hover) !important;
	}

	.horizontal-list .list-container .list-item h4 {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
	}

	.horizontal-list .list-container .list-item a {
		text-decoration: none;
	}

	.horizontal-list .list-container .list-item a:hover {
		text-decoration: underline;
	}

	.horizontal-list .list-container .list-item .list-item-info h4 {
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.horizontal-list .list-container .list-item .list-item-info a {
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.horizontal-list .list-container .list-item .list-item-info a:hover {
		text-decoration: underline;
	}
	.info-action {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
