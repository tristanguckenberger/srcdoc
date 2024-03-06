<script>
	// @ts-nocheck
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';

	export let name;
	export let description;
	export let isPublic;
</script>

<EditPlaylistDetails {name} {description} {isPublic} />
