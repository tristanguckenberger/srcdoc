<script>
	// @ts-nocheck
	import EditGameDetails from '$lib/ui/Modal/components/EditGameDetails.svelte';

	let {
		gameId,
		title,
		description,
		thumbnail,
		published,
		headerImage
	} = $props();
</script>

<EditGameDetails {gameId} {title} {description} {thumbnail} {published} {headerImage} />
