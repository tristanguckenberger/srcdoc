<script>
	// @ts-nocheck
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';

	export let gameId;
	export let title;
	export let description;
	export let thumbnail;
	export let published;
	export let headerImage;
</script>

<EditGameDetails {gameId} {title} {description} {thumbnail} {published} {headerImage} />
