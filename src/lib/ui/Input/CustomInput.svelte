<script>
	import { run } from 'svelte/legacy';

	// @ts-nocheck
	import {
		gameDetails,
		gameTitle,
		gameDescription,
		gameIsPublished,
		gameImage
	} from '$lib/stores/gameDetailsStore';
	import { modalProps } from '$lib/stores/layoutStore.js';

	/**
	 * @typedef {Object} Props
	 * @property {any} [blurAction]
	 * @property {any} inputCapture
	 * @property {any} inputText
	 * @property {any} inputValue
	 * @property {boolean} [hidden]
	 * @property {string} [placeholder]
	 * @property {import('svelte').Snippet} [label]
	 * @property {import('svelte').Snippet} [icon]
	 */

	/** @type {Props} */
	let {
		blurAction = () => {},
		inputCapture,
		inputText = $bindable(),
		inputValue = $bindable(),
		hidden = false,
		placeholder = '',
		label,
		icon
	} = $props();

	let checked;
	run(() => {
		checked = inputValue ? 'true' : 'false';
	});

	run(() => {
		inputText,
			(() => {
				switch (inputCapture) {
					case 'title':
						gameTitle.set(inputText ?? $modalProps?.title);
						inputText = $gameTitle;
						break;
					case 'description':
						gameDescription.set(inputText ?? $modalProps?.description);
						inputText = $gameDescription;
						break;
					case 'image':
						gameImage.set(inputText ?? $modalProps?.image);
						inputText = $gameImage;
						break;
					case 'published':
						gameIsPublished.set(inputValue ?? $modalProps?.published);
						inputValue = $gameIsPublished;
						break;
					default:
						break;
				}
			})();
	});
</script>

<div class="input-container modal">
	{@render label?.()}
	<div class="row modal" class:hideMe={hidden}>
		{@render icon?.()}
		{#if inputCapture === 'image'}
			<input
				type="file"
				{hidden}
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'id'}
			<input class:hideMe={hidden} type="text" {hidden} name={inputCapture} />
		{:else if inputCapture === 'username'}
			<input
				type="text"
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'bio'}
			<textarea
				class="description-input"
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			></textarea>
		{:else if inputCapture === 'profile_photo'}
			<textarea
				class:hideMe={hidden}
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			></textarea>
		{:else if inputCapture === 'published' || inputCapture === 'hidePopUpInfoHome' || inputCapture === 'hidePopUpInfoGames' || inputCapture === 'hidePopUpInfoEditor' || inputCapture === 'darkMode'}
			<input
				class:hideMe={hidden}
				type="text"
				{hidden}
				name={inputCapture}
				bind:value={checked}
				onblur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'is_public' || inputCapture === 'isPublic'}
			<input
				class:hideMe={hidden}
				type="text"
				{hidden}
				name={inputCapture}
				bind:value={checked}
				onblur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'description' || inputCapture === 'reviewBody'}
			<textarea
				class="description-input"
				{placeholder}
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			></textarea>
		{:else if inputCapture === 'query'}
			<input
				class:hideMe={hidden}
				class="search-input"
				placeholder="Find something..."
				type="text"
				{hidden}
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			/>
		{:else}
			<input
				class:hideMe={hidden}
				type="text"
				{hidden}
				{placeholder}
				name={inputCapture}
				bind:value={inputText}
				onblur={() => {
					blurAction();
				}}
			/>
		{/if}
	</div>
</div>

<style>
	.input-container {
		display: column;
		flex-direction: row;
	}
	.row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		border-radius: 4px;
		background-color: var(--input-bg);
		padding: 1px;
		margin-top: 4px;
		max-width: calc(100% - 0px);
		max-height: 330px;
	}
	:global(.input-label) {
		font-weight: 500;
		font-size: 1rem;
		font-family: var(--header-font), sans-serif;
		color: var(--color-primary);
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		flex-grow: 1;
		padding: 5px;
		font-family: var(--paragraph-font), sans-serif;
		color: var(--darker-bg);
	}
	input:focus-visible {
		outline: var(--vibrant-orange) auto 1px;
	}
	input:focus:not(.focus-visible) {
		outline: none;
	}
	:global(.input-icon) {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(.input-icon svg) {
		width: 24px;
		height: 24px;
		fill: #dedbd7;
	}
	.description-input {
		min-height: 150px;
		width: 100%;
		resize: vertical;
		max-height: 300px;
		background-color: var(--input-bg);
		border: none;
		padding: 5px;
		font-size: 1rem;
		font-family: 'Nunito', sans-serif;
		color: var(--darker-bg);
	}
	.input-container.modal .row.modal.hideMe {
		opacity: 0;
		height: 0px !important;
		width: 0px !important;
	}
	input.search-input {
		color: var(--color-secondary) !important;
	}
</style>
