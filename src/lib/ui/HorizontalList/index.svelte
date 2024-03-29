<script>
	// @ts-nocheck
	export let items = [];
	export let type = '';
	export let title = '';
	export let subtitle = '';
	export let link = '';
</script>

/** * Horizontal List - A component to display Horizontal List of content * preferably playlists,
games, or users * * @prop {Array} items - An array of items to display * @prop {String} type - The type
of items to display * @prop {String} title - The title of the list * @prop {String} subtitle - The subtitle
of the list * @prop {String} link - The link to the full list grid */

<div class="horizontal-list">
	<h3>{title}</h3>
	<h4>{subtitle}</h4>
	<div class="list-container">
		{#each items as item}
			<div class="list-item">
				<a href={link}>
					<img src={item.thumbnail} alt={item.name} />
					<div class="list-item-info">
						<h4>{item.name}</h4>
						<p>{item.description}</p>
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.horizontal-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.horizontal-list h3 {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-primary);
	}

	.horizontal-list h4 {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
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
	}

	.horizontal-list .list-container .list-item img {
		width: 100px;
		height: 100px;
		border-radius: 10px;
	}

	.horizontal-list .list-container .list-item h4 {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
	}

	.horizontal-list .list-container .list-item p {
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
	}

	.horizontal-list .list-container .list-item a {
		text-decoration: none;
	}

	.horizontal-list .list-container .list-item a:hover {
		text-decoration: underline;
	}

	.horizontal-list .list-container .list-item .list-item-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.horizontal-list .list-container .list-item .list-item-info h4 {
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.horizontal-list .list-container .list-item .list-item-info p {
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
</style>
