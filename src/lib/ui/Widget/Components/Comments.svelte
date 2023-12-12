<script>
	// @ts-nocheck
	import Comment from '$lib/ui/Comment/Index.svelte';

	export let gameId;
	export let userId;
	export let comments;
	export let parentCommentId;
	export let hasChildren = false;

	$: console.log('comments::gameId', gameId);
</script>

<Comment {gameId} {userId} {comments} {parentCommentId} {hasChildren} />
