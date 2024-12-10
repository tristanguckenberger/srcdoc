<script>
	// @ts-nocheck
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';

	let { name, description, isPublic } = $props();
</script>

<EditPlaylistDetails {name} {description} {isPublic} />
