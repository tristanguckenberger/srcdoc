<script>
	// @ts-nocheck
	import {
		gameDetails,
		gameTitle,
		gameDescription,
		gameIsPublished,
		gameImage
	} from '$lib/stores/gameDetailsStore';
	import { modalProps } from '$lib/stores/layoutStore.js';

	export let blurAction = () => {};
	export let inputCapture;
	export let inputText;
	export let inputValue;
	export let hidden = false;
	export let placeholder = '';

	$: checked = inputValue ? 'true' : 'false';

	$: inputText,
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

	$: console.log('inputCapture::inputText', inputCapture);
</script>

<div class="input-container modal">
	<slot name="label" />
	<div class="row modal" class:hideMe={hidden}>
		<slot name="icon" />
		{#if inputCapture === 'image'}
			<input
				type="file"
				{hidden}
				name={inputCapture}
				bind:value={inputText}
				on:blur={() => {
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
				on:blur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'bio'}
			<textarea
				class="description-input"
				name={inputCapture}
				bind:value={inputText}
				on:blur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'profile_photo'}
			<textarea
				class:hideMe={hidden}
				name={inputCapture}
				bind:value={inputText}
				on:blur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'published' || inputCapture === 'hidePopUpInfoHome' || inputCapture === 'hidePopUpInfoGames' || inputCapture === 'hidePopUpInfoEditor' || inputCapture === 'darkMode'}
			<input
				class:hideMe={hidden}
				type="text"
				{hidden}
				name={inputCapture}
				bind:value={checked}
				on:blur={() => {
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
				on:blur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'description' || inputCapture === 'reviewBody'}
			<textarea
				class="description-input"
				{placeholder}
				name={inputCapture}
				bind:value={inputText}
				on:blur={() => {
					blurAction();
				}}
			/>
		{:else if inputCapture === 'query'}
			<input
				class:hideMe={hidden}
				placeholder="Find something..."
				type="text"
				{hidden}
				name={inputCapture}
				bind:value={inputText}
				on:blur={() => {
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
				on:blur={() => {
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
</style>
