<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { afterUpdate, onMount, tick } from 'svelte';
	import AddCommentForm from '$lib/ui/Form/AddCommentForm.svelte';
	import AddReplyForm from '$lib/ui/Form/AddReplyForm.svelte';
	import UpdateCommentForm from '$lib/ui/Form/UpdateCommentForm.svelte';
	import {
		commentSystemExpanderStore,
		commentStoreComments,
		editComment as submitEdit
	} from '$lib/stores/commentStore.js';
	import { themeDataStore } from '$lib/stores/themeStore';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import CaretDown from '$lib/assets/CaretDown.svg';
	import CaretLeft from '$lib/assets/CaretLeft.svg';

	export let gameId;
	export let userId;
	export let comments;
	export let parentCommentId;
	export let hasChildren = false;

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
		init = true;

		if (comments /** && timeout === false*/) {
			commentStoreComments.set(comments);
		}
	});

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
		commentText.set(newCommentText);
	}
	function cancelEditingComment(comment) {
		isEditing = false;
		editingId = null;
		$commentText = '';
		$commentText = '';
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
		if (disabledToggle) {
			return;
		}
		$commentSystemExpanderStore[id] = !$commentSystemExpanderStore[id];
		commentSystemExpanderStore.set($commentSystemExpanderStore);
		tick();
	}
	function autoResize() {
		newCommentTextArea.style.height = 'fit-content';
		let textAreaCharCount = newCommentTextArea?.value?.length;
		const textAreaLineCount = newCommentTextArea?.value?.split('\n').length;
		const textAreaCalculatedLineCountByCharacters = Math.floor(
			newCommentTextArea?.style?.fontSize / newCommentTextArea?.style?.width
		);

		if (init) {
			newCommentTextArea.style.height = 'fit-content';
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else if (textAreaLineCount <= 1 && textAreaCharCount < 87) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else if (newCommentTextArea.scrollHeight <= 46 && newCommentTextArea.scrollHeight > 30) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
		} else if (newCommentTextArea.scrollHeight == 50) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
		}

		if (textAreaCharCount > newCommentMaxLength) {
			// dont allow more than 1500 characters
			newCommentTextArea.value = newCommentTextArea?.value?.slice(0, 1500);
			textAreaCharCount = newCommentMaxLength;
		}

		init = false;
		newCommentTotalCharacters = textAreaCharCount;
	}
	function calculateGradientDirctionAndPosition(deg) {
		const gradientDirection = deg;
		const gradientPosition = gradientDirection / 360;

		// switch (gradientPosition) {

		// }

		return gradientPosition;
	}

	const commentText = writable('');
	const newCommentMaxLength = 1500;

	let isEditing = false;
	let editingId = null;
	let userName = '';
	let preventOpen = false;
	let newCommentText = '';
	let creatingComment = false;
	let newCommentParent = null;
	let oldCommentText = '';
	let init = false;
	let newCommentTotalCharacters = 0;
	let inputText = '';
	let newCommentTextArea;
	let showNewCommentActions = false;
	let disabledToggle = false;

	$: reactiveGameId = gameId;
	$: reactiveUserId = userId;
	$: hasChildren = threadedComments[0]?.children?.length >= 1;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: newCommentTextArea && init && autoResize();
	$: threadedComments = buildItemThreads(parentCommentId, $commentStoreComments ?? comments);
	$: comments, commentStoreComments.set(comments);
	$: disabledToggle === true,
		setTimeout(() => {
			disabledToggle = false;
		}, 50);
</script>

<svelte:window
	on:click={(e) => {
		if (e.target.classList.contains('reply') || e.target.classList.contains('edit')) {
			disabledToggle = true;
		}
	}}
	on:load={() => {
		console.log('::on:load::');
		// console.log('::comments::', comments);
		// console.log('::threadedComments::', threadedComments);

		// find .comment-container.parent::after
		const after = document.querySelector('.comment-container.parent::after');
		console.log('::after::', after);
		// add event listener to .comment-container.parent::after for on click
		after.addEventListener('click', (e) => {
			console.log('::after::onclick::');
		});
	}}
/>

{#if parentCommentId === null}
	<AddCommentForm {gameId} {comments} {parentCommentId} />
{/if}
<ul
	class="comment-tree"
	class:isRoot={parentCommentId === null}
	class:hasChildren
	style={`${themeString} --caret-down: url('${CaretDown}'); --caret-left: url('${CaretLeft}');`}
	class:noComments={threadedComments.length === 0}
>
	{#if threadedComments?.length === 0}
		<p class="no-comments">Be the first to leave a comment</p>
	{:else}
		{#await threadedComments then threads}
			{#each threads as comment, i (comment.id)}
				<li
					class="comment-item"
					style={`--multiplyer: ${calculateGradientDirctionAndPosition(270 * (i + 1))}rad;`}
				>
					{#if comment.type === 'parent'}
						{#if isEditing && editingId === comment.id}
							<div
								class="comment parent row"
								class:expanded={$commentSystemExpanderStore[comment.id]}
							>
								<UpdateCommentForm
									{comment}
									bind:isEditingUpdate={isEditing}
									inputText={comment?.commentText}
								/>
							</div>
						{:else}
							<div
								class="comment-container parent"
								class:expanded={$commentSystemExpanderStore[comment.id]}
							>
								<Button
									link="/users/{comment?.userId}"
									userName={`@${comment?.userName}`}
									userAvatar={comment?.userAvatar}
									style={'padding: 0 10px; background-color: transparent !important; width: fit-content !important;'}
								/>
								<div
									class="comment parent row"
									class:expanded={$commentSystemExpanderStore[comment.id]}
								>
									<p>
										<span class="commentText">{comment.commentText}</span>
									</p>
									<div class="actions">
										<Button
											action={() => startEditingComment(comment)}
											label={'Edit'}
											additionalClasses={'existing-comment-action edit'}
										/>
										<Button
											action={() => startCreatingComment(comment)}
											label={'Reply'}
											additionalClasses={'existing-comment-action reply'}
										/>
									</div>
								</div>
								<div
									class="after-icon"
									on:click={() => {
										toggleComment(comment);
									}}
								>
									<img
										src={$commentSystemExpanderStore[comment.id] ? CaretDown : CaretLeft}
										alt="caret-left"
									/>
								</div>
							</div>
						{/if}
					{:else if comment.type === 'parent-no-children'}
						{#if isEditing && editingId === comment.id}
							<UpdateCommentForm
								{comment}
								bind:isEditingUpdate={isEditing}
								inputText={comment?.commentText}
							/>
						{:else}
							<div class="comment-container">
								<Button
									link="/users/{comment?.userId}"
									userName={`@${comment?.userName}`}
									userAvatar={comment?.userAvatar}
									style={'padding: 0 10px; background-color: transparent !important; width: fit-content !important;'}
								/>
								<div class="comment parent-no-children row">
									<p>
										{comment?.commentText}
									</p>
									<div class="actions">
										<Button
											action={() => startEditingComment(comment)}
											label={'Edit'}
											additionalClasses={'existing-comment-action edit'}
										/>
										<Button
											action={() => startCreatingComment(comment)}
											label={'Reply'}
											additionalClasses={'existing-comment-action reply'}
										/>
									</div>
								</div>
							</div>
						{/if}
					{:else if isEditing && editingId === comment.id}
						<div class="comment child row" class:expanded={$commentSystemExpanderStore[comment.id]}>
							<UpdateCommentForm
								{comment}
								bind:isEditingUpdate={isEditing}
								inputText={comment?.commentText}
							/>
						</div>
					{:else}
						<div class="comment-container">
							<Button
								link="/users/{comment?.userId}"
								userName={`@${comment?.userName}`}
								userAvatar={comment?.userAvatar}
								style={'padding: 0 10px; background-color: transparent !important; width: fit-content !important;'}
							/>
							<div class="comment child row">
								<p>
									{comment?.commentText}
								</p>
								<div class="actions">
									<Button
										action={() => startEditingComment(comment)}
										label={'Edit'}
										additionalClasses={'existing-comment-action edit'}
									/>
									<Button
										action={() => startCreatingComment(comment)}
										label={'Reply'}
										additionalClasses={'existing-comment-action reply'}
									/>
								</div>
							</div>
						</div>
					{/if}
					{#if creatingComment && newCommentParent.id === comment.id}
						<AddReplyForm
							bind:creatingReply={creatingComment}
							{comment}
							userId={comment?.userId ?? comment?.user_id}
							{comments}
							parentCommentId={newCommentParent?.id}
						/>
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
	{/if}
</ul>

<style>
	.comment-tree {
		display: flex;
		flex-direction: column;
		gap: 20px;
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
		padding-left: 40px;
		padding-top: 10px;
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
	.comment.row {
		display: flex;
		flex-direction: column;
		align-items: normal;
	}
	.actions {
		display: flex;
		flex-direction: row;
		width: 110px;
		gap: 10px;
	}
	.comment-tree.hasChildren::after {
		/* border-left: 1px solid rgb(135, 35, 35) !important; */
		/* content: '>'; */
	}
	.comment-tree.noComments {
		border-left: 0;
	}
	.comment-tree.isRoot {
		padding-top: 20px;
	}
	.no-comments {
		color: var(--text-color-primary);
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 400;
		font-size: 0.9rem;
		text-align: center;
		margin-block-start: 4rem;
		margin-block-end: 20vh;
		display: none;
	}
	:global(button.isDoneButton:hover) {
		background-color: #23486d !important;
	}
	:global(button.existing-comment-action),
	:global(a.existing-comment-action) {
		height: 36.5px !important;
		background-color: transparent;
	}

	/* reply button styles */
	:global(button.existing-comment-action.reply),
	:global(a.existing-comment-action.reply) {
		background-color: transparent;
	}

	/* edit button styles */
	:global(button.existing-comment-action.edit),
	:global(a.existing-comment-action.edit) {
		background-color: transparent;
		padding-left: 0;
	}

	/* edit button :hover styles */
	:global(button.existing-comment-action.edit:hover),
	:global(a.existing-comment-action.edit:hover) {
		background-color: transparent !important;
	}

	/* reply button :hover styles */
	:global(button.existing-comment-action.reply:hover),
	:global(a.existing-comment-action.reply:hover) {
		background-color: #23486d !important;
	}
	.comment p {
		color: var(--text-color-primary);
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 400;
		font-size: 0.9rem;
	}
	.comment.parent.row {
		/* padding: 0; */
		color: var(--folder-button-color);
		position: relative;
	}
	.comment.parent.row .commentText {
		color: var(--text-color-primary);
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 400;
		font-size: 0.9rem;
	}
	.comment-container.parent {
		background-color: #1d1e205c;
		padding-top: 23px;
		border-radius: 8px;
		transition: background-color 0.1s linear;
		background: hsla(0, 0%, 16%, 1);
		background: linear-gradient(167deg, hsla(0, 0%, 16%, 1) 21%, hsla(0, 0%, 35%, 1) 76%);
		background: -moz-linear-gradient(315deg, hsla(0, 0%, 16%, 1) 21%, hsla(0, 0%, 35%, 1) 76%);
		background: -webkit-linear-gradient(
			var(--multiplyer),
			var(--faded-highlight) 1%,
			var(--darker-bg) 99%
		);
	}

	.comment-container.parent::after {
		/* content: '<';
		font-family: 'Recursive', sans-serif;
		position: absolute;
		top: 7px;
		right: 23px;
		font-size: 1.5rem;
		font-weight: 400;
		color: #2a2b2e;
		z-index: 20; */
	}

	.comment-container.parent.expanded {
		background-color: #24242447;
		padding-top: 23px;
		border-radius: 8px;
	}
	.comment-container.parent.expanded::after {
		/* content: 'v';
		font-family: 'Recursive', sans-serif;
		position: absolute;
		top: 7px;
		right: 23px;
		font-size: 1.5rem;
		font-weight: 400;
		color: #2a2b2e; */
	}
	/* .comment.parent.row p .commentText::before {
		padding-right: 20px;
		content: '>';
	}

	.comment.parent.row.expanded p .commentText::before {
		content: 'v';
	} */
	/* .after-icon {
		display: none;
	} */

	.comment-container.parent .after-icon {
		font-family: 'Recursive', sans-serif;
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 1.5rem;
		font-weight: 400;
		color: #2a2b2e;
		background-color: var(--button-highlight);
		padding: 6px;
		border-radius: 6px;

		display: flex;
		justify-content: center;
		align-items: center;
		transition: color 0.2s linear;
	}

	.comment-container.parent .after-icon img {
		filter: brightness(0.5);
		transition: filter 0.2s linear;
		width: 15.6px;
		height: 15.6px;
	}

	.after-icon:hover {
		cursor: pointer;
	}
	.comment-container.parent:hover {
		cursor: default !important;
	}
	.comment.parent.row:hover {
		cursor: default !important;
	}

	.comment-container.parent .after-icon:hover img {
		filter: brightness(1);
	}
	.comment-container {
		padding-left: 20px;
		padding-top: 20px;
	}
</style>
