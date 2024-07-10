<script>
	// @ts-nocheck
	import Tab from './Tab.svelte';
	import {
		openFiles,
		focusedFileId,
		previouslyFocusedFileId,
		codePanes2,
		focusedFolderId
	} from '$lib/stores/filesStore.js';

	import { themeDataStore } from '$lib/stores/themeStore';

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
			previouslyFocusedFileId.set($focusedFileId);
			focusedFileId.set(nextFile.id);
			focusedFolderId.set(null);
		}

		if ($openFiles?.length === 0) {
			previouslyFocusedFileId.set($focusedFileId);
			focusedFileId.set(null);
			$codePanes2 = [];
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
		try {
			e.preventDefault();
			if (draggedItem === null) return;

			const draggedIndex = $openFiles?.findIndex((f) => f?.id === draggedItem?.id);
			const targetIndex = $openFiles?.findIndex((f) => f?.id === file?.id);

			if (draggedIndex === targetIndex) return;
			const newOpenFiles = [...$openFiles];
			[newOpenFiles[draggedIndex], newOpenFiles[targetIndex]] = [
				newOpenFiles[targetIndex],
				newOpenFiles[draggedIndex]
			];

			$openFiles = newOpenFiles;
		} catch (error) {
			console.log('error::', error);
		}
	}

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div class="tab-container" style={`${themeString}`}>
	{#each $openFiles as file}
		<div>
			<Tab {file} {closeTab} />
		</div>
	{/each}
</div>

<style>
	.tab-container {
		display: flex;
		flex-direction: row;
		/* background-color: var(--color-secondary); */
		overflow-x: auto;
		overflow-y: hidden;
		height: 30px;
		flex-grow: 1;
		gap: 3px;
		margin-bottom: 10px;
		margin-top: -10px;
	}
</style>
