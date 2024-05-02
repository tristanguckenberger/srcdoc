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

	export let parentHeight = 0;

	let docsSelection;
	let selectedOption = 0;
	let contentHeight = 0;

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

	$: canNavigateNext = selectedOption < docs.length - 1;
	$: canNavigatePrevious = selectedOption > 0;
</script>

<div class="documentation-container">
	<select
		name="docs-selection"
		id="docs-selection"
		on:change={handleDocPageChange}
		bind:this={docsSelection}
	>
		{#each docs as doc, i}
			<option value={i}>{doc?.title}</option>
		{/each}
	</select>

	<div
		class="documentation-content"
		style={'--content-height: ' +
			contentHeight +
			'px;' +
			' --parent-height: ' +
			parentHeight +
			'px;'}
	>
		<div class="doc-navigation-container">
			<button disabled={!canNavigatePrevious} on:click={() => navigate('prev')}>Previous</button>
			<button disabled={!canNavigateNext} on:click={() => navigate('next')}>Next</button>
		</div>
		<h1>{docs[selectedOption]?.title}</h1>
		<div
			class="content-gen"
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
		height: calc(var(--parent-height) - 100px);
		/* overflow: scroll; */
	}
	.content-gen {
		overflow: hidden;
		height: calc(var(--parent-height) - 20%);
	}
	.content-gen.allowScroll {
		overflow-y: auto;
		/* height: var(--content-height); */
		display: flex;
		flex-direction: column;
	}
	:global(.documentation-content pre) {
		width: 100%;
	}

	:global(.documentation-content pre code) {
		width: 100%;
		white-space: pre-wrap;
	}
	:global(.documentation-content img) {
		width: 80%;
		border-radius: 3px;
		background: var(--menu-bg);
		padding: 4px;
	}
</style>
