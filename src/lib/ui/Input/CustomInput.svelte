<script>
	// @ts-nocheck
	import { gameDetails, gameTitle, gameDescription, gameImage } from '$lib/stores/gameDetailsStore';
	import { modalProps } from '$lib/stores/layoutStore.js';

	export let blurAction = () => {};
	export let inputCapture;
	export let inputText;
	export let hidden = false;

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
				default:
					break;
			}
		})();

	// $: console.log('inputText::', inputText);
	// $: console.log('$modalProps::', $modalProps);
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
		{:else if inputCapture === 'description'}
			<textarea
				class="description-input"
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
		background-color: #fffbe4;
		padding: 5px;
		margin-top: 4px;
		max-width: calc(100% - 0px);
		max-height: 330px;
	}
	:global(.input-label) {
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		font-size: 1rem;
		color: #fffbe4;
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		color: #2e324c;
		flex-grow: 1;
	}
	input:focus-visible {
		outline: var(--vibrant-orange) auto 1px;
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
	}
	.hideMe {
		opacity: 0;
	}
</style>
