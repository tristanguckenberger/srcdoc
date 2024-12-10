<script>
	// @ts-nocheck
	/**
	 * @name Documentation
	 * @description This is a documentation component, it is used to display documentation for the application
	 * and is primarily embedded in the editor, but can be used in other parts of the application.
	 *
	 *
	 * It needs to be able to:
	 * - Display documentation
	 * - Display code snippets
	 * - Display images
	 * - Display videos *eventually*
	 * - Display links
	 * - Have a dropdown at the top to select the documentation to display
	 * - Have previous and next links to navigate through the documentation, placed at the bottom of the page
	 * - Be self-contained, meaning it should be able to be used in any part of the application
	 *
	 * Add Basic editor documentation in a new js file that exports a json object with the following structure:
	 * [
	 *     {
	 *        "title": "Title of the documentation",
	 *       "content": "Content of the documentation",
	 *     },
	 *     {...},
	 *     {...}
	 * ]
	 *
	 */

	// Svelte Imports
	import { tick } from 'svelte';

	// Data imports
	import { docs } from '$lib/platformCopy/docs.js';

	/**
	 * @typedef {Object} Props
	 * @property {number} [parentHeight]
	 */

	/** @type {Props} */
	let { parentHeight = 0 } = $props();

	let docsSelection = $state();
	let contentGen = $state();
	let window;
	let selectedOption = $state(0);
	let contentHeight = $state(0);

	async function handleDocPageChange(event) {
		await tick();
		selectedOption = event.target.value;
	}

	async function navigate(direction) {
		let selectedCopy = parseInt(selectedOption);
		direction === 'next' ? (selectedCopy += 1) : (selectedCopy -= 1);
		selectedOption = selectedCopy;
		await tick();
		docsSelection.value = selectedOption;
	}

	let canNavigateNext = $derived(selectedOption < docs.length - 1);
	let canNavigatePrevious = $derived(selectedOption > 0);
</script>

<div class="documentation-container">
	<div class="select-nav">
		<select
			name="docs-selection"
			id="docs-selection"
			onchange={handleDocPageChange}
			bind:this={docsSelection}
		>
			{#each docs as doc, i}
				<option value={i}>{doc?.title}</option>
			{/each}
		</select>
		<div class="doc-navigation-container">
			<button
				disabled={!canNavigatePrevious}
				class:disabled={!canNavigatePrevious}
				onclick={() => navigate('prev')}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
					/></svg
				></button
			>
			<button
				disabled={!canNavigateNext}
				class:disabled={!canNavigateNext}
				onclick={() => navigate('next')}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
					/></svg
				></button
			>
		</div>
	</div>
	<div
		class="documentation-content"
		style={'--content-height: ' +
			contentHeight +
			'px;' +
			' --parent-height: ' +
			parentHeight +
			'px;'}
	>
		<!-- <h1>{docs[selectedOption]?.title}</h1> -->
		<div
			class="content-gen"
			bind:this={contentGen}
			bind:clientHeight={contentHeight}
			class:allowScroll={contentHeight > 0}
		>
			{@html docs[selectedOption]?.content}
		</div>
	</div>
</div>

<style>
	.documentation-container {
		/* overflow-y: auto; */
		overflow: hidden;
	}
	.documentation-content {
		color: var(--color-primary);
		height: calc(var(--parent-height) - 123px);
		/* overflow: scroll; */
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.content-gen {
		overflow: hidden;
		height: calc(var(--parent-height));
	}
	.content-gen.allowScroll {
		overflow-y: auto;
		display: flex;
		background-color: var(--search-result-card);
		flex-direction: column;
		padding: 20px;
		border-radius: 6px;
	}
	.doc-navigation-container {
		display: flex;
		flex-direction: row;
		gap: 10px;
	}
	.select-nav {
		display: flex;
		flex-direction: row;
		padding-bottom: 10px;
		align-items: center;
		gap: 10px;
	}
	.documentation-container button {
		background: none;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		border-radius: 4px;
	}
	.documentation-container button svg {
		width: 23px;
		height: 23px;
		fill: var(--color-primary);
	}
	.documentation-container button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	select {
		height: 36.5px;
		font-family: 'Nunito', sans-serif;
		border-radius: 4px;
		font-weight: 650;
		color: var(--color-primary);
		background: var(--color-primary-muted);
	}
	:global(.documentation-content h1),
	:global(.documentation-content h2),
	:global(.documentation-content h3) {
		margin-block-end: 0;
		font-family: var(--header-font);
	}
	:global(.documentation-content li) {
		font-family: var(--paragraph-font);
		font-size: 14px;
	}
	:global(.documentation-content strong) {
		font-family: var(--header-font);
		/* font-size: 1.2rem; */
	}
	:global(.documentation-content h3) {
		text-decoration: underline;
	}
	:global(.documentation-content p) {
		font-family: var(--paragraph-font);
		margin-block-start: 5px;
	}
	:global(.documentation-content p:first-of-type) {
		margin-block-start: 0;
	}
	:global(.documentation-content h1:first-of-type) {
		margin-block-start: 0;
	}
	:global(.documentation-content hr) {
		width: 100%;
		border-color: var(--color-primary);
		border-radius: 20px;
		border: 1px solid;
	}

	:global(.documentation-content pre) {
		background-color: var(--purple-main);
		padding: 1rem;
		border-radius: 6px;
		overflow: scroll;
		min-height: fit-content;
	}

	:global(.documentation-content pre code) {
		white-space: inherit;
		overflow-x: scroll;
		font-family: 'Fira Code', monospace;
		font-size: 0.8rem;
	}
	:global(.documentation-content img) {
		width: 80%;
		border-radius: 3px;
		background: var(--menu-bg);
		padding: 4px;
	}
	:global(.documentation-content ul) {
		/* width: 80%;
		border-radius: 3px;
		background: var(--menu-bg);
		padding: 4px; */
		margin-block-start: 0;
	}
	:global(.documentation-content hr) {
		margin-block-start: -5px;
	}
	:global(.documentation-content span) {
		font-family: var(--paragraph-font);
	}
	:global(.documentation-content ul li) {
		font-family: var(--paragraph-font);
	}
</style>
