<script>
	export let data;
</script>

<div class="main">
	{#each data?.games as game}
		<div class="game">
			<a href={`/games/${game?.id}`}>Play</a>
			<h3>{game.title}</h3>
			<p>{game.description}</p>
		</div>
	{/each}
</div>

<style>
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		/* overflow-y: hidden; */
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.game {
		width: 300px;
		height: 300px;
		border: 1px solid black;
		border-radius: 6px;
		margin: 10px;
		padding: 10px;
	}
	.game:hover {
		background-color: #333;
		color: white;
		cursor: pointer;
	}
</style>
