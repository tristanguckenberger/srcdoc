<script>
	// @ts-nocheck
	import Tab from './Tab.svelte';
	import { openFiles, focusedFileId } from '$lib/stores/filesStore.js';

	let draggedItem = null;

	function closeTab(id) {
		$openFiles = $openFiles.filter((file) => file.id !== id);
		if ($focusedFileId === id) {
			focusedFileId.set(null);
		}
	}

	function dragStart(e, file) {
		console.log('dragStart');
		draggedItem = file;
	}

	function dragOver(e, file) {
		console.log('dragOver');
		console.log('draggedItem: ', draggedItem);
		console.log('file: ', file);
		e.preventDefault();
	}

	function dragEnd() {
		console.log('dragEnd');
		draggedItem = null;
	}

	function drop(e, file) {
		console.log('drop');
		e.preventDefault();
		console.log('draggedItem: ', draggedItem);
		if (draggedItem === null) return;

		const draggedIndex = $openFiles.findIndex((f) => f.id === draggedItem.id);
		const targetIndex = $openFiles.findIndex((f) => f.id === file.id);

		const newOpenFiles = [...$openFiles];
		[newOpenFiles[draggedIndex], newOpenFiles[targetIndex]] = [
			newOpenFiles[targetIndex],
			newOpenFiles[draggedIndex]
		];

		$openFiles = newOpenFiles;
	}
</script>

<div class="tab-container">
	{#each $openFiles as file}
		<div on:drop={(e) => drop(e, file)}>
			<Tab {file} {closeTab} {dragStart} {dragOver} {dragEnd} />
		</div>
	{/each}
</div>

<style>
	/* Style your tab container here */
	.tab-container {
		display: flex;
		flex-direction: row;
		background-color: #333;
		overflow-x: auto;
		/* padding: 5px; */
	}
</style>
