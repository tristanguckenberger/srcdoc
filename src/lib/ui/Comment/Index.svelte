<script>
	// @ts-nocheck
	import { writable } from 'svelte/store';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';

	import {
		commentSystemExpanderStore,
		commentStoreComments,
		editComment as submitEdit
	} from '$lib/stores/commentStore.js';
	import { themeDataStore } from '$lib/stores/themeStore';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	export let gameId;
	export let userId;
	export let comments;
	export let parentCommentId;
	export let hasChildren = false;

	const commentText = writable('');
	let threadedComments = buildItemThreads(parentCommentId, comments);
	let isEditing = false;
	let editingId = null;
	let userName = '';
	let preventOpen = false;
	let newCommentText = '';
	let creatingComment = false;
	let newCommentParent = null;
	let oldCommentText = '';

	$: reactiveGameId = gameId;
	$: reactiveUserId = userId;
	$: hasChildren = threadedComments[0]?.children?.length >= 1;

	function startCreatingComment(comment) {
		creatingComment = true;
		newCommentParent = comment;
		// TODO: focus on the input element
	}

	function confirmCommentCreation() {
		createComment(newCommentText, newCommentParent, comments);
		creatingComment = false;
		newCommentText = '';
		newCommentParent = null;
	}

	function cancelCommentCreation() {
		creatingComment = false;
		newCommentText = '';
	}

	function cancelEditingComment(comment) {
		isEditing = false;
		editingId = null;
		$commentText = '';
		$commentText = oldCommentText;
		preventOpen = false;
	}

	function completeEditingComment(comment) {
		editComment(comment);
		isEditing = false;
		editingId = null;
		$commentText = '';
		preventOpen = false;
	}

	function deleteComment(comment) {
		// Add your logic to delete the comment
		deleteComments(comment?.id, comments);
	}

	function saveComment(comment) {
		// Add your logic to save the comment
	}

	function startEditingComment(comment) {
		// Add your logic to edit the comment
		oldCommentText = comment.commentText;
		isEditing = true;
		editingId = comment.id;
		$commentText = comment.commentText;
		preventOpen = true;
	}

	function editComment(comment) {
		// Add your logic to edit the comment
		submitEdit(comment.id, $commentText, comments);
		// isEditing = false;
	}

	function buildItemThreads(parentId, items) {
		const threads = [];

		for (const item of items) {
			if (item.parentCommentId === parentId) {
				const children = buildItemThreads(item.id, items);

				threads.push({
					...item,
					type: children?.length >= 1 ? 'parent' : parentId ? 'child' : 'parent-no-children',
					children,
					isExpanded: $commentSystemExpanderStore[item.id] ?? false
				});
			}
		}

		return threads;
	}

	function toggleComment({ id }, comment) {
		$commentSystemExpanderStore[id] = !$commentSystemExpanderStore[id];
		commentSystemExpanderStore.set($commentSystemExpanderStore);
		tick();
	}

	// We want to automatically thread the comments when the comments change (aka when a new comment is created or a comment is deleted)
	$: $commentStoreComments && $commentStoreComments?.length > 0,
		(() => {
			if ($commentStoreComments?.length > 0) {
				threadedComments = buildItemThreads(parentCommentId, $commentStoreComments);
				comments = $commentStoreComments;
			}
		})();

	afterUpdate(() => {
		if (threadedComments?.length > 0) {
			comments.forEach((comment) => {
				if (comment.type === 'parent') {
					$commentSystemExpanderStore[comment.id] = true;
				}
			});
			commentSystemExpanderStore.set($commentSystemExpanderStore);
		}
	});

	onMount(() => {
		/**
		 * check if gameId matches the current game id in the store.
		 *
		 * This persists the store and then wipes it ONLY if the user visits a new game.
		 *
		 */

		if (comments /** && timeout === false*/) {
			commentStoreComments.set(comments);
		}
	});

	$: themeString = $themeDataStore?.theme?.join(' ');

	$: console.log('commentText::', $commentText);
</script>

<ul class="comment-tree" class:hasChildren style={themeString}>
	{#await threadedComments then threads}
		{#each threads as comment (comment.id)}
			<li class="comment-item">
				{#if comment.type === 'parent'}
					{#if isEditing && editingId === comment.id}
						<div
							class="comment parent row"
							class:expanded={$commentSystemExpanderStore[comment.id]}
						>
							<textarea
								bind:value={$commentText}
								on:blur={() => {
									editComment(comment);
									isEditing = false;
									editingId = null;
									$commentText = '';
									preventOpen = false;
								}}
							/>
							<div class="actions">
								<Button action={() => completeEditingComment(comment)} label={'Done'} />
								<Button action={() => cancelEditingComment(comment)} label={'Cancel'} />
							</div>
						</div>
					{:else}
						<div
							class="comment parent row"
							class:expanded={$commentSystemExpanderStore[comment.id]}
							on:click={() => toggleComment(comment)}
						>
							<p>
								{comment.commentText}
							</p>
							<div class="actions">
								<Button action={() => startCreatingComment(comment)} label={'Reply'} />
								<Button action={() => startEditingComment(comment)} label={'Edit'} />
							</div>
						</div>
					{/if}
				{:else if comment.type === 'parent-no-children'}
					{#if isEditing && editingId === comment.id}
						<div
							class="comment parent-no-children row"
							class:expanded={$commentSystemExpanderStore[comment.id]}
						>
							<textarea
								bind:value={$commentText}
								on:blur={() => {
									editComment(comment);
									isEditing = false;
									editingId = null;
									$commentText = '';
									preventOpen = false;
								}}
							/>
							<div class="actions">
								<Button action={() => completeEditingComment(comment)} label={'Done'} />
								<Button action={() => cancelEditingComment(comment)} label={'Cancel'} />
							</div>
						</div>
					{:else}
						<div class="comment parent-no-children row">
							<p>
								{comment?.commentText}
							</p>
							<div class="actions">
								<Button action={() => startCreatingComment(comment)} label={'Reply'} />
								<Button action={() => startEditingComment(comment)} label={'Edit'} />
							</div>
						</div>
					{/if}
				{:else if isEditing && editingId === comment.id}
					<div class="comment child row" class:expanded={$commentSystemExpanderStore[comment.id]}>
						<textarea
							bind:value={$commentText}
							on:blur={() => {
								editComment(comment);
								isEditing = false;
								editingId = null;
								$commentText = '';
								preventOpen = false;
							}}
						/>
						<div class="actions">
							<Button action={() => completeEditingComment(comment)} label={'Done'} />
							<Button action={() => cancelEditingComment(comment)} label={'Cancel'} />
						</div>
					</div>
				{:else}
					<div class="comment child row">
						<p>
							{comment?.commentText}
						</p>
						<div class="actions">
							<Button action={() => startCreatingComment(comment)} label={'Reply'} />
							<Button action={() => startEditingComment(comment)} label={'Edit'} />
						</div>
					</div>
				{/if}
				{#if creatingComment && newCommentParent.id === comment.id}
					<div class="newCommentInput">
						<CustomInput bind:inputText={$commentText} />
						<button on:click={confirmCommentCreation}>Done</button>
						<button on:click={cancelCommentCreation}>Cancel</button>
					</div>
				{/if}
				{#if $commentSystemExpanderStore[comment.id] && comment.children && comment.children.length > 0}
					<ul class="nested">
						<svelte:self
							{comments}
							parentCommentId={comment.id}
							gameId={reactiveGameId}
							userId={reactiveUserId}
							hasChildren={true}
						/>
					</ul>
				{/if}
			</li>
		{/each}
	{/await}
</ul>

<style>
	.comment-tree {
		border-left: 1px solid var(--text-box-outline);
	}
	.comment-tree,
	.nested {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.comment p {
		margin-block-end: 0;
		margin-block-start: 0;
	}
	.nested {
		padding-left: 16px;
	}
	.comment-item {
		padding: 0;
		color: var(--folder-button-color);
		position: relative;
	}
	.parent-no-children {
		padding-left: 20px;
	}
	.parent {
		background: none;
		border: none;
		color: var(--folder-button-color);
		font-size: var(--base-font-size);
		cursor: pointer;
		padding-left: 20px;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 16px;
		background-image: none;
	}
	.parent:hover {
		color: var(--text-color-highlight);
	}
	.comment {
		font-size: var(--base-font-size);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 10px;
	}
	.child {
		padding-left: 10px;
	}
	.comment textarea {
		width: calc(100% - 15px);
		height: 250px;
		min-height: 100px;
		border: 2px solid var(--text-box-outline);
		border-radius: 6px;
		min-width: calc(100% - 15px);
		max-width: calc(100% - 15px);
	}
	.comment.row {
		display: flex;
		flex-direction: column;
		align-items: normal;
	}
	.actions {
		display: flex;
		flex-direction: row-reverse;
		width: 110px;
	}
	.comment-tree.hasChildren {
		border-left: 1px solid rgb(0, 0, 0, 0.24);
	}
</style>
