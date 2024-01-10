<script>
	//@ts-nocheck
	import { goto } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';

	export let data;

	let filteredGames;
	let pickedGame;

	onMount(() => {
		if (data?.quickPlayGames?.length > 0) {
			filteredGames = data.quickPlayGames;

			// Randomly select a single game
			pickedGame = [filteredGames[Math.floor(Math.random() * filteredGames.length)]];
		}
	});

	afterUpdate(() => {
		if (
			(data?.quickPlayGames?.length > 0 && !pickedGame) ||
			filteredGames?.length !== data.quickPlayGames?.length
		) {
			filteredGames = data.quickPlayGames;
			pickedGame = [filteredGames[Math.floor(Math.random() * filteredGames.length)]];
		}
	});

	// $: (() => {
	$: if (pickedGame) {
		goto(`/games/${pickedGame[0]?.id}/play`);
	}
	// })();
</script>
