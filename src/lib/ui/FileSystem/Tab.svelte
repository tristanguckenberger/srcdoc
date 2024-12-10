<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
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
	import { clearSplit, splitInstanceStore } from '$lib/stores/splitStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { addPaddingToEditorStore } from '$lib/stores/editorStore';
	import { afterUpdate, tick } from 'svelte';

	import { throttle, debounce } from 'lodash-es';
	import { invalidateAll } from '$app/navigation';

	export let file;
	export let closeTab;
	export let dragStart;
	export let dragOver;
	export let dragEnd;

	let canSave = false;
	let hideAnyway = false;

	$: isFocused = file?.id?.toString() === $focusedFileId?.toString();
	$: isSoftSelected = file?.id?.toString() === $softSelectedFileId?.toString();
	$: if ($filesToUpdate?.some((fileToUpdate) => fileToUpdate?.id === file?.id)) {
		canSave = true;
	} else {
		canSave = false;
	}

	afterUpdate(() => {
		$addPaddingToEditorStore =
			file?.id.toString() === $focusedFileId?.toString() ||
			file?.id?.toString() === $softSelectedFileId?.toString();
	});

	async function handleClose(file) {
		// await tick();
		if (
			$filesToUpdate?.some((fileToUpdate) => fileToUpdate?.id?.toString() === file?.id?.toString())
		) {
			const areYouSure = confirm(
				'Closing the file without saving will undo your changes... Do you want to continue?'
			);

			if (areYouSure) {
				// remove file from filesToUpdate
				$filesToUpdate = $filesToUpdate?.filter((fileToUpdate) => {
					return file?.id?.toString() !== fileToUpdate?.id?.toString();
				});
			} else {
				return;
			}
		}
		closeTab(file.id);

		// If the file is open in a pane, close it.
		const paneID = `#split-${file?.name}-${file?.type}-${file?.id}`;

		if ($softSelectedFileId?.toString() === file?.id?.toString()) {
			$softSelectedFileId = null;
		}

		if ($focusedFileId?.toString() === file?.id?.toString()) {
			$focusedFileId = null;
		}

		const paneCopy = [...$codePanes2];

		codePanes2.set(
			paneCopy?.filter((pane) => {
				return pane.paneID !== paneID;
			})
		);
		splitInstanceStore.set(null);
		triggerCompile.set(true);
		$addPaddingToEditorStore = false;
		await invalidateAll();
	}

	const tdClose = throttle(
		debounce(async (file) => await handleClose(file), 100),
		100
	);

	// Handle File Double Click
	async function handleFileDBClick(file) {
		await tick();
		// If the file is not already open, is not a folder, AND is soft selected, then open it.
		if (
			!$openFiles?.some((openFile) => openFile?.id?.toString() === file?.id?.toString()) &&
			file.type !== 'folder'
		) {
			$openFiles = [...$openFiles, file];
		}

		if ($softSelectedFileId?.toString() === file?.id?.toString()) {
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

	async function HandleFileSingleClick(file) {
		await tick();

		// If the file is already focused, return early
		if ($focusedFileId?.toString() === file?.id?.toString()) {
			return;
		}

		// Update the focused and previously focused files
		$previouslyFocusedFileId = $focusedFileId;
		$focusedFileId = file?.id;
		$focusedFolderId = null;

		// Update the openFiles array if the file isn't already open
		const isFileAlreadyOpen = $openFiles?.some(
			(openFile) => openFile?.id?.toString() === file?.id?.toString()
		);

		if (!isFileAlreadyOpen && file?.type !== 'folder') {
			$openFiles = [...$openFiles, file];
		}

		// Optionally trigger auto-compile if required
		if ($autoCompile) {
			$clearSplit = true;
		}
	}

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div style={` ${themeString} `} class="tab" class:isFocused>
	<span
		class:isSoftSelected
		on:dblclick={() => handleFileDBClick(file)}
		on:click|stopPropagation={() => HandleFileSingleClick(file)}>{file.name}.{file.type}</span
	>
	<div class="tab-close" on:click={() => tdClose(file)} class:canSave class:showAnyway={hideAnyway}>
		X
	</div>
	<div class="white-dot-container" class:canSave>
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
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
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
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 30 !important;
		font-family: 'Nunito';
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
		font-family: 'Source Sans 3', sans-serif;
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
