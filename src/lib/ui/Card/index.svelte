<script>
	// @ts-nocheck
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';
	// import { session } from ''

	export let game;
	export let thumbnail;
	export let user;
	let imageLoaded = false;

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div class="game" style={`${themeString}`}>
	<a href={`/games/${game?.id}/main`}>
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
		<a href={`/games/${game?.id}/main`}>
			<h3>{game.title}</h3>
			<p>{game.description}</p>
		</a>
		<div class="card-action-container">
			<div class="btn-flex">
				<Button link={`/games/${game?.id}/play`} label={'Play'} />
				<Button
					link={null}
					label={'fav'}
					action={() => {
						console.log('fav');
					}}
				/>
			</div>
			{#if user === game?.userId}
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
		/* border: 1px solid #fbfbfb; */
		/* background-color: #fbfbfb; */
		border-radius: 6px;
		margin: 0;
		padding: 10px;
		background-color: #202021;
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
</style>
