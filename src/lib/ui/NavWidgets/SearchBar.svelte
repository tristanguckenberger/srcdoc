<script>
	// @ts-nocheck
	/**
	 * SearchBar.svelte
	 * @description A flexible search bar component
	 *
	 * @param {string} placeholder
	 * @param {string} value
	 * @param {string} id
	 * @param {string} name
	 * @param {string} type
	 * @param {string} label
	 * @param {string} icon
	 * @param {string} iconColor
	 * @param {string} iconSize
	 * @param {string} iconPosition
	 * @param {string} iconClass
	 * @param {string} iconStyle
	 * @param {string} inputClass
	 * @param {string} inputStyle
	 * @param {string} labelClass
	 * @param {string} labelStyle
	 * @param {string} containerClass
	 * @param {string} containerStyle
	 * @param {string} formClass
	 * @param {string} formStyle
	 * @param {string} buttonClass
	 * @param {string} buttonStyle
	 *
	 * @slot icon - optional
	 * @slot label - optional
	 * @slot input - optional
	 * @slot button - optional
	 *
	 *
	 */

	// Svelte imports
	import { enhance } from '$app/forms';
	import { beforeNavigate, invalidateAll } from '$app/navigation';

	// Store imports
	import { searchResultsStore, searchHasResultsStore } from '$lib/stores/search/searchStore';

	// Component imports
	import CustomInput from '../Input/CustomInput.svelte';

	export let placeholder = 'Search...';
	export let value = '';
	export let id = '';
	export let name = '';
	export let type = 'text';
	export let label = '';
	export let icon = '';
	export let iconColor = '';
	export let iconSize = '';
	export let iconPosition = '';
	export let iconClass = '';
	export let iconStyle = '';
	export let inputClass = '';
	export let inputStyle = '';
	export let labelClass = '';
	export let labelStyle = '';
	export let containerClass = '';
	export let containerStyle = '';
	export let formClass = '';
	export let formStyle = '';
	export let buttonClass = '';
	export let buttonStyle = '';

	let inputId = id || name;
	let searchQuery;
	let inputStyleString = '';
	let labelStyleString = '';
	let iconStyleString = '';
	let containerStyleString = '';
	let formStyleString = '';
	let buttonStyleString = '';

	$: console.log('searchQuery::', searchQuery);
	$: console.log('searchResultsStore::', $searchResultsStore);
	$: console.log('$searchResultsStore::', $searchHasResultsStore);

	beforeNavigate(() => {
		searchResultsStore.set([]);
		searchQuery = null;
	});
</script>

<div class={`search-bar-container ${containerClass}`} style={containerStyleString}>
	<form
		class={`search-bar-form ${formClass}`}
		style={formStyleString}
		action="?/search"
		method="POST"
		use:enhance={({ formElement, formData, action, cancel }) => {
			return async ({ result }) => {
				if (result.status === 200) {
					console.log('search result::', result);
					$searchResultsStore = result?.data?.result;
				}
			};
		}}
	>
		{#if label}
			<label for={inputId} class={`search-bar-label ${labelClass}`} style={labelStyleString}>
				<slot name="label">
					{label}
				</slot>
			</label>
		{/if}
		<div class={`search-bar-input-container ${iconPosition}`} style={inputStyleString}>
			<slot name="icon">
				{#if icon}
					<div class={`search-bar-icon ${iconClass}`} style={iconStyleString}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="#000000"
							viewBox="0 0 256 256"
							><path
								d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
							/></svg
						>
					</div>
				{/if}
			</slot>
			<div class="inputAndButton">
				<slot name="input">
					<CustomInput inputCapture="query" bind:inputText={searchQuery} />
				</slot>
				<slot name="button">
					<button
						class={`search-bar-button ${buttonClass}`}
						style={buttonStyleString}
						type="submit"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="#ffffff"
							viewBox="0 0 256 256"
							><path
								d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"
							/></svg
						>
					</button>
				</slot>
			</div>
			{#if $searchResultsStore?.length > 0 || searchQuery}
				<button
					class="cancel-button"
					on:click|preventDefault={() => {
						searchResultsStore.set([]);
						searchQuery = null;
						invalidateAll();
						searchQuery = null;
					}}
					aria-roledescription="cancel search button"
					><svg
						class="cancel-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
						/></svg
					></button
				>
			{/if}
		</div>
	</form>
</div>

<style>
	.search-bar-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.search-bar-form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.search-bar-label {
		margin-bottom: 0.5em;
	}
	.search-bar-input-container {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.search-bar-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0.5em;
	}
	.search-bar-input {
		flex: 1;
		padding: 10px;
		height: 1rem;
		border-radius: 0.25em;
		border: none;
		background-color: #171819;
		color: var(--color-primary);
		font-family: 'Inter', sans-serif;
		font-size: 1.125rem;
		border-radius: 6px;
		transition: all 0.5s cubic-bezier(0.87, -0.41, 0.19, 1.44);
	}
	.search-bar-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25em;
		background-color: var(--search-button);
		border: none;
		height: 36px;
		width: 36px;
		cursor: pointer;
		align-self: center;
	}
	.search-bar-button svg {
		fill: var(--color-primary-muted) !important;
	}
	.search-bar-button:hover {
		/* background-color: var(--button-blue-hover); */
	}
	.search-bar-input-container.left {
		justify-content: flex-start;
	}

	.search-bar-input-container.right {
		justify-content: flex-end;
	}
	.inputAndButton {
		display: flex;
		gap: 10px;
		align-items: center;
		width: 100%;
	}
	.inputAndButton :global(.input-container) {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		width: 100%;
	}
	.inputAndButton :global(.row) {
		display: flex;
		flex-direction: row;
		gap: 10px;
		border-radius: 4px;
		background-color: var(--search-bar-bg);
		max-width: calc(100% - 0px);
		max-height: 330px;
		width: 100%;
		margin-top: 0 !important;
		padding: 0 !important;
		height: 36px;
		/* border: 2px solid var(--dark-yellow); */
	}
	.inputAndButton :global(input) {
		color: var(--color-primary) !important;
	}

	.inputAndButton :global(input:focus-visible) {
		outline: var(--color-primary-muted) solid 2px;
		border-radius: 4px;
	}
	.cancel-button {
		background: unset;
		border: unset;
		position: absolute;
		right: 115px;
		top: 7px;
	}
	.cancel-icon {
		width: 20px;
		height: 20px;
		fill: var(--color-primary-muted);
	}

	.cancel-icon:hover {
		fill: var(--dark-yellow);
		cursor: pointer;
	}
</style>
