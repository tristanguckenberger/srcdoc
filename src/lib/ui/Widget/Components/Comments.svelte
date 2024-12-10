<script>
	// @ts-nocheck
	import Comment from '$lib/ui/Comment/Index.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	
	/**
	 * @typedef {Object} Props
	 * @property {any} gameId
	 * @property {any} userId
	 * @property {any} parentCommentId - export let comments = [];
	 * @property {boolean} [hasChildren]
	 */

	/** @type {Props} */
	let {
		gameId,
		userId,
		parentCommentId,
		hasChildren = false
	} = $props();

	let comments = $state([]);

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
