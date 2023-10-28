<script>
	// @ts-nocheck
	import Tab from './Tab.svelte';
	import { openFiles, focusedFileId } from '$lib/stores/filesStore.js';

	let draggedItem = null;

	function closeTab(id) {
		const tabIndex = $openFiles.findIndex((file) => file.id === id);
		$openFiles = $openFiles.filter((file) => file.id !== id);
		if ($focusedFileId === id) {
			focusedFileId.set(null);
		}
		// If there are still open files, focus the next one.
		if ($openFiles?.length > 0) {
			const nextFile = $openFiles[tabIndex] || $openFiles[tabIndex - 1];
			focusedFileId.set(nextFile.id);
		}
	}

	function dragStart(e, file) {
		draggedItem = file;
	}

	function dragOver(e, file) {
		e.preventDefault();
	}

	function dragEnd() {
		draggedItem = null;
	}

	function drop(e, file) {
		e.preventDefault();
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
	.tab-container {
		display: flex;
		flex-direction: row;
		background-color: #333;
		overflow-x: auto;
		height: 30px;
		flex-grow: 1;
	}
</style>
