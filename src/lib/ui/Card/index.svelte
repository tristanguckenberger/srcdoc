<script>
	// @ts-nocheck
	import { themeDataStore } from '$lib/stores/themeStore';

	export let game;

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div class="game" style={`${themeString}`}>
	<a href={`/games/${game?.id}/main`}>
		<img class="card-thumbnail" src={game?.thumbnail ?? 'https://picsum.photos/300/300'} />
	</a>
	<div class="card-info">
		<a href={`/games/${game?.id}/play`}>Play</a>
		<a href={`/games/${game?.id}/engine`}>Open in Engine</a>
		<a href={`/games/${game?.id}/main`}>
			<h3>{game.title}</h3>
			<p>{game.description}</p>
		</a>
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
	}
	.card-info {
		color: var(--color-primary);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		/* border: 2px solid #fbfbfb; */
		border-radius: 6px;
		/* background-color: #fbfbfb; */
		padding: 10px;
	}
	.card-info a {
		color: var(--color-primary);
		text-decoration: none;
	}
	.card-info:hover {
		cursor: pointer;
		/* box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.75); */
	}
</style>
