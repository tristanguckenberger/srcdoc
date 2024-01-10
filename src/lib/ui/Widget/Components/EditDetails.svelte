<script>
	// @ts-nocheck
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';

	export let gameId;
	export let title;
	export let description;
	export let headerImage;

	$: console.log('comments::gameId', gameId);
</script>

<EditGameDetails {gameId} {title} {description} {headerImage} />
