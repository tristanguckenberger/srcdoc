<script>
	// @ts-nocheck
	import Comment from '$lib/ui/Comment/Index.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let gameId;
	export let userId;
	// export let comments = [];
	export let parentCommentId;
	export let hasChildren = false;

	let comments = [];

	const slug = $page.params.slug;

	onMount(async () => {
		if (slug) {
			const commentResponse = await fetch(`/api/comments/byGameId/${slug}`);

			const commentData = await commentResponse.json();
			comments = commentData?.comments ?? [];
		}
	});
</script>

<Comment {gameId} {userId} {comments} {parentCommentId} {hasChildren} />
