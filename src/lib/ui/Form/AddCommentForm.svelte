<script>
	import { run, preventDefault } from 'svelte/legacy';

	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount, tick } from 'svelte';

	import { commentSystemExpanderStore, commentStoreComments } from '$lib/stores/commentStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { platformSession } from '$lib/stores/platformSession';

	let {
		gameId,
		userId,
		comments,
		parentCommentId
	} = $props();

	const commentText = writable('');
	const newCommentMaxLength = 1500;

	let init = $state(false);
	let newCommentTotalCharacters = $state(0);
	let inputText = $state('');
	let newCommentTextArea = $state();
	let showNewCommentActions = $state(false);

	onMount(() => {
		init = true;
	});

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

	run(() => {
		comments, commentStoreComments.set(comments);
	});
	let threadedComments = $derived(buildItemThreads(parentCommentId, $commentStoreComments ?? comments));
	run(() => {
		newCommentTextArea && init && autoResize();
	});
	let commentCountLabel = $derived(`${($commentStoreComments ?? comments)?.length ?? 0} Comment${
		threadedComments?.length >= 1 ? (threadedComments?.length === 1 ? '' : 's') : 's'
	}`);
</script>

<form
	method="POST"
	action="/games/?/addNewComment"
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		formData.set('comment', inputText);
		formData.set('gameId', gameId);
		return async ({ result, update }) => {
			if (result.status === 200) {
				await update();
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<div class="character-count-container">
		<h2>
			{commentCountLabel}
		</h2>
		<h3>
			<span
				class="total"
				class:alertRunningOut150={newCommentTotalCharacters > 1350}
				class:alertRunningOut100={newCommentTotalCharacters > 1400}
				>{newCommentTotalCharacters}</span
			>/<span class="limit">{newCommentMaxLength}</span>
		</h3>
	</div>
	<textarea
		placeholder="Leave a comment"
		aria-multiline="false"
		bind:this={newCommentTextArea}
		class="new-comment-input"
		name={'comment'}
		bind:value={inputText}
		onfocus={async () => (showNewCommentActions = true) && (await tick())}
		oninput={() => autoResize(`text-area-root`)}
	></textarea>
	{#if showNewCommentActions}
		<div class="comment-action-container">
			<Button label="Done" disabled={!$platformSession?.currentUser?.id} />
			<button
				class="isCancelButton"
				formaction=""
				onclick={preventDefault(() => {
					inputText = '';
					showNewCommentActions = false;
				})}>Cancel</button
			>
		</div>
	{/if}
</form>

<style>
	.new-comment-input {
		height: fit-content;
		width: 100%;
		resize: none;
		box-sizing: border-box;
		padding-bottom: 8px;
		line-height: calc(1rem + 5px);
		overflow: hidden;
		background-color: transparent;
		color: var(--text-color-primary);
		font-family: 'IBM Plex Sans', sans-serif;
		border: 0;
		border-bottom: 2px solid rgb(66, 66, 66);
		transition: border 200ms cubic-bezier(0.55, 0.06, 0.68, 0.19);
		font-size: 1rem;
	}
	.new-comment-input:focus-visible {
		outline: none;
		border-bottom: 2px solid var(--color-accent);
	}
	.total.alertRunningOut150 {
		color: var(--dark-yellow);
	}
	.total.alertRunningOut100 {
		color: rgb(165, 30, 30);
	}
	.character-count-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: end;
	}
	.character-count-container h2 {
		color: var(--text-color-primary);
		font-family: var(--header-font);
		font-size: 1rem;
		margin-block-start: 0;
		font-weight: 900;
	}
	.character-count-container h3 {
		padding: 10px;
		width: fit-content;
		color: var(--text-color-primary);
		font-family: 'IBM Plex Sans';
		font-size: 0.8rem;
		font-weight: 400;
		margin-top: 0;
	}
	.comment-action-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		gap: 10px;
	}
	.comment-action-container :global(button) {
		background-color: #4ca5ff94;
		height: 36.5px;
	}
	:global(button.isDoneButton:hover) {
		background-color: #4ca5ff94 !important;
	}

	button.isCancelButton {
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 36.5px;
		font-weight: 500;
		background-color: transparent !important;
	}
	button.isCancelButton:hover {
		background-color: transparent !important;
		cursor: pointer;
	}
	:global(button.existing-comment-action),
	:global(a.existing-comment-action) {
		height: 36.5px;
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
</style>
