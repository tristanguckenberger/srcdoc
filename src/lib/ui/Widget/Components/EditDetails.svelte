<script>
	// @ts-nocheck
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';

	export let gameId;
	export let title;
	export let description;
	export let published;
	export let headerImage;
</script>

<EditGameDetails {gameId} {title} {description} {published} {headerImage} />
