<script>
	// @ts-nocheck
	import Tab from './Tab.svelte';
	import {
		openFiles,
		focusedFileId,
		previouslyFocusedFileId,
		codePanes2,
		focusedFolderId,
		filesToUpdate
	} from '$lib/stores/filesStore.js';

	import { themeDataStore } from '$lib/stores/themeStore';
	import { tick } from 'svelte';

	let draggedItem = null;

	async function closeTab(id) {
		// await tick();
		try {
			const tabIndex = $openFiles?.findIndex((file) => file?.id?.toString() === id?.toString());
			if ($focusedFileId?.toString() === id?.toString()) {
				focusedFileId.set(null);
			}
			$openFiles = $openFiles?.filter((file) => file?.id?.toString() !== id?.toString());

			// If there are still open files, focus the next one.
			if ($openFiles?.length > 0) {
				const nextFile = $openFiles?.[tabIndex] || $openFiles?.[tabIndex - 1];
				$previouslyFocusedFileId = $focusedFileId;

				// This if block triggers the error
				if ($focusedFileId?.toString() === id?.toString()) {
					$focusedFileId = nextFile.id;
				}
				// $focusedFolderId = null;
				// previouslyFocusedFileId.set($focusedFileId);
				// focusedFileId.set(nextFile.id);
				// focusedFolderId.set(null);
			}

			if ($openFiles?.length === 0) {
				// previouslyFocusedFileId.set($focusedFileId);
				$previouslyFocusedFileId = $focusedFileId;
				// focusedFileId.set(null);
				$focusedFileId = null;
				$codePanes2 = [];
			}
		} catch (error) {
			console.log('error::', error);
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
	{#each $openFiles as file (file?.id)}
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
