<script>
	// @ts-nocheck
	import { focusedFileId, softSelectedFileId, openFiles } from '$lib/stores/filesStore.js';

	export let file;
	export let closeTab;
	export let dragStart;
	export let dragOver;
	export let dragEnd;

	$: isFocused = file?.id === $focusedFileId;
	$: isSoftSelected = file?.id === $softSelectedFileId;

	function handleClose() {
		closeTab(file.id);
	}

	// Handle File Double Click
	function handleFileDBClick(file) {
		console.log('handleFileDBClick::Tab', file);
		// If the file is not already open, is not a folder, AND is soft selected, then open it.
		if (!$openFiles?.some((openFile) => openFile.id === file.id) && file.type !== 'folder') {
			$openFiles = [...$openFiles, file];
		}

		if ($softSelectedFileId === file.id) {
			softSelectedFileId.set(null);
		}

		// set the focused file to the file that was double clicked.
		focusedFileId.set(file.id);
	}

	// Handle File Single Click
	function HandleFileSingleClick(file) {
		const isFileAlreadyOpen = $openFiles?.some((openFile) => openFile.id === file.id);

		// If the clicked file is already open and not soft-selected, focus it and return.
		if (isFileAlreadyOpen && $softSelectedFileId !== file.id) {
			focusedFileId.set(file.id);
			return;
		}

		// Handle the case where a soft-selected file exists.
		if ($softSelectedFileId && $softSelectedFileId !== file.id) {
			$openFiles = $openFiles.filter((openFile) => openFile.id !== $softSelectedFileId);
			softSelectedFileId.set(file.id);
		}

		// Handle the case where the clicked file is already open but not soft-selected.
		if (isFileAlreadyOpen && file.type !== 'folder') {
			$openFiles = $openFiles.filter((openFile) => openFile.id !== file.id);
			softSelectedFileId.set(file.id);
			$openFiles = [...$openFiles, file];
		}

		// Handle the case where the clicked file is neither open nor a folder.
		if (!isFileAlreadyOpen && file.type !== 'folder') {
			softSelectedFileId.set(file.id);
			$openFiles = [...$openFiles, file];
		}

		// Finally, focus on the clicked file.
		focusedFileId.set(file.id);
	}
</script>

<div
	class="tab"
	class:isFocused
	draggable="true"
	on:dragstart={(e) => dragStart(e, file)}
	on:dragover={(e) => dragOver(e, file)}
	on:dragend={dragEnd}
>
	<span
		class:isSoftSelected
		on:click={() => HandleFileSingleClick(file)}
		on:dblclick={() => handleFileDBClick(file)}>{file.name}.{file.type}</span
	>
	<button class="tab-close" on:click={handleClose}>X</button>
</div>

<style>
	.tab {
		display: flex;
		flex-direction: row;
		background-color: #333;
		padding: 4px 5px 4px 5px;
	}

	.tab:hover {
		cursor: pointer;
	}

	.tab span {
		padding-right: 5px;
		border-bottom: 1px solid transparent;
	}

	.tab-close {
		background: none;
		border: none;
		color: #ccc;
		font-weight: bold;
		font-size: 12px;
		padding: 0;
		margin: 0;
		opacity: 0;
	}

	.tab:hover > .tab-close {
		opacity: 1;
	}
	.tab.isFocused {
		background-color: #444;
		border-bottom: 1px solid #ccc;
	}
	.tab span.isSoftSelected {
		font-style: italic;
	}
</style>
