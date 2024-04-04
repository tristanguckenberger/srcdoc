<script>
	// @ts-nocheck
	import {
		focusedFileId,
		softSelectedFileId,
		openFiles,
		codePanes2,
		previouslyFocusedFileId,
		autoCompile,
		triggerCompile,
		filesToUpdate,
		focusedFolderId
	} from '$lib/stores/filesStore.js';
	import { clearSplit } from '$lib/stores/splitStore';
	import { themeDataStore } from '$lib/stores/themeStore';

	export let file;
	export let closeTab;
	export let dragStart;
	export let dragOver;
	export let dragEnd;

	let canSave = false;
	let hideAnyway = false;

	$: isFocused = file?.id.toString() === $focusedFileId.toString();
	$: isSoftSelected = file?.id === $softSelectedFileId;
	$: if ($filesToUpdate?.some((fileToUpdate) => fileToUpdate?.id === file?.id)) {
		canSave = true;
	} else {
		canSave = false;
	}

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
		focusedFolderId.set(null);
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
			focusedFolderId.set(null);
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
		focusedFolderId.set(null);
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
	on:mouseover={() => {
		if (canSave && !hideAnyway) {
			hideAnyway = true;
		}
	}}
	on:mouseout={() => {
		hideAnyway = false;
	}}
>
	<span
		class:isSoftSelected
		on:click={() => HandleFileSingleClick(file)}
		on:dblclick={() => handleFileDBClick(file)}>{file.name}.{file.type}</span
	>
	<button
		class="tab-close"
		on:click={() => handleClose(file)}
		class:canSave
		class:showAnyway={hideAnyway}>X</button
	>
	<div
		class="white-dot-container"
		class:canSave
		on:mouseover={() => {
			if (canSave && !hideAnyway) {
				hideAnyway = true;
			}
		}}
		on:mouseout={() => {
			hideAnyway = false;
		}}
	>
		<span class="white-dot" class:canSave class:hideAnyway />
	</div>
</div>

<style>
	.white-dot-container {
		width: 20px;
		height: 20px;
		position: absolute;
		right: 0px;
		top: 3px;
	}
	.white-dot-container:hover {
		/* display: none !important; */
	}
	.white-dot {
		display: none;
		width: 3px;
		height: 7px;
		background-color: var(--text-color-primary);
		border-radius: 50% 50%;
		margin-left: 5px;
		position: relative;
		top: 6px;
		right: -1.5px;
	}
	.white-dot.canSave {
		display: block;
	}
	.white-dot:hover {
		/* display: none !important; */
	}
	.tab {
		display: flex;
		flex-direction: row;
		background-color: var(--color-secondary);
		padding: 4px 5px 3px 5px;
		border-radius: 4px;
		position: relative;
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
		z-index: 30 !important;
	}

	.tab:hover > .tab-close {
		opacity: 1;
	}

	.tab.canSave > .tab-close {
		opacity: 0;
	}
	.tab.isFocused {
		background-color: var(--button-highlight);
		border-bottom: 4px solid var(--color-accent);
		border-radius: 4px;
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
	/* .white-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		background-color: white;
		border-radius: 50%;
		margin-left: 5px;
	} */
	button.canSave {
		/* display: none; */
		/* opacity: 0 !important; */
	}
	button.canSave:hover {
		/* opacity: 1 !important; */
		/* cursor: pointer; */
		/* display: block !important; */
	}
	.hideAnyway {
		display: none !important;
	}
	.showAnyway {
		display: block !important;
		opacity: 1 !important;
		z-index: 30 !important;
		cursor: pointer;
	}
</style>
