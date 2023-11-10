<script>
	// @ts-nocheck
	import {
		focusedFileId,
		softSelectedFileId,
		openFiles,
		codePanes2,
		previouslyFocusedFileId,
		autoCompile,
		triggerCompile
	} from '$lib/stores/filesStore.js';
	import { clearSplit } from '$lib/stores/splitStore';
	import { themeDataStore } from '$lib/stores/themeStore';

	export let file;
	export let closeTab;
	export let dragStart;
	export let dragOver;
	export let dragEnd;

	$: isFocused = file?.id.toString() === $focusedFileId.toString();
	$: isSoftSelected = file?.id === $softSelectedFileId;

	function handleClose(file) {
		closeTab(file.id);

		// If the file is open in a pane, close it.
		const paneID = `#split-${file?.name}-${file?.type}-${file?.id}`;

		if ($softSelectedFileId === file.id) {
			softSelectedFileId.set(null);
		}

		if ($focusedFileId === file.id) {
			focusedFileId.set(null);
		}

		const paneCopy = [...$codePanes2];

		codePanes2.set(
			paneCopy?.filter((pane) => {
				return pane.paneID !== paneID;
			})
		);
		triggerCompile.set(true);
	}

	// Handle File Double Click
	function handleFileDBClick(file) {
		// If the file is not already open, is not a folder, AND is soft selected, then open it.
		if (!$openFiles?.some((openFile) => openFile.id === file.id) && file.type !== 'folder') {
			$openFiles = [...$openFiles, file];
		}

		if ($softSelectedFileId === file.id) {
			softSelectedFileId.set(null);
		}

		// set the focused file to the file that was double clicked.
		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(file.id);
		if ($autoCompile) {
			clearSplit.set(true);
		}
	}

	// Handle File Single Click
	function HandleFileSingleClick(file) {
		const isFileAlreadyOpen = $openFiles?.some((openFile) => openFile.id === file.id);

		// If the clicked file is already open and not soft-selected, focus it and return.
		if (isFileAlreadyOpen && $softSelectedFileId !== file.id) {
			previouslyFocusedFileId.set($focusedFileId);
			focusedFileId.set(file.id);
			if ($autoCompile) {
				clearSplit.set(true);
			}
			return;
		}

		// Handle the case where a soft-selected file exists.
		if ($softSelectedFileId && $softSelectedFileId !== file.id) {
			$openFiles = $openFiles.filter((openFile) => openFile.id !== $softSelectedFileId);
			softSelectedFileId.set(file.id);
			$openFiles = [...$openFiles, file];
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

		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(file.id);
		if ($autoCompile) {
			clearSplit.set(true);
		}
	}

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div
	style={`${themeString}`}
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
	{#if $openFiles.find((openFile) => openFile.id === file.id)?.needsSave}
		<span class="white-dot" />
	{/if}
	<button class="tab-close" on:click={() => handleClose(file)}>X</button>
</div>

<style>
	.tab {
		display: flex;
		flex-direction: row;
		background-color: var(--color-secondary);
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
		color: var(--folder-button-color);
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
		background-color: var(--button-highlight);
		border-bottom: 4px solid var(--color-accent);
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
	}
	.tab span {
		color: var(--folder-button-color);
	}
	.tab.isFocused span {
		color: var(--color-accent) !important;
	}
	.tab span.isSoftSelected {
		color: var(--text-color-highlight);
		font-style: italic;
	}
	.white-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		background-color: white;
		border-radius: 50%;
		margin-left: 5px;
	}
</style>
