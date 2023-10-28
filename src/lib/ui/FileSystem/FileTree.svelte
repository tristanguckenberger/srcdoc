<script>
	// @ts-nocheck
	import File from './File.svelte';
	import {
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		openFiles,
		focusedFileId,
		softSelectedFileId,
		openInNewPane,
		codePanes2,
		derivedCodeData
	} from '$lib/stores/filesStore.js';
	import { clearSplit } from '$lib/stores/splitStore';
	import { onMount, tick } from 'svelte';

	export let gameId;
	export let userId;
	export let files;
	export let parentFileId;

	$: reactiveGameId = gameId;
	$: reactiveUserId = userId;

	/**
	 * DEBUG PLAN
	 *
	 * handleFileDBClick
	 *
	 * HandleFileSingleClick
	 *
	 * openNewPane
	 *
	 *
	 * @param file
	 */

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
		focusedFileId.set(file.id);
		clearSplit.set(true);
	}

	// // Helper function to update open files
	// function updateOpenFiles(fileId, filesArray, add = true) {
	// 	const newArray = filesArray.filter((file) => file.id !== fileId);
	// 	return add ? [...newArray, fileId] : newArray;
	// }

	// Handle File Single Click
	async function HandleFileSingleClick(file) {
		// Finally, focus on the clicked file.
		const isFileAlreadyOpen = $openFiles?.some((openFile) => openFile.id === file.id);
		const isFileInCodePanes2 = $codePanes2?.some((pane) => pane.fileId === file.id);

		// if theres a soft selected file and its not the clicked file, remove it
		if ($softSelectedFileId && $softSelectedFileId !== file.id) {
			// remove the soft selected file from the open files array
			$openFiles = $openFiles.filter((openFile) => openFile.id !== $softSelectedFileId);
			// remove the soft selected file from the codePanes2 array
			$codePanes2 = $codePanes2.filter((pane) => pane.fileId !== $softSelectedFileId);
			// set $softSelectedFileId to null
			softSelectedFileId.set(null);
			// set $focusedFileId to null
			focusedFileId.set(null);
			// set the new soft selected file to the clicked file.
			softSelectedFileId.set(file.id);
			// set the new focused file to the clicked file.
			focusedFileId.set(file.id);
		} else if ($softSelectedFileId === file.id) {
			focusedFileId.set(file.id);
		}

		if (!isFileAlreadyOpen && file.type !== 'folder') {
			$openFiles = [...$openFiles, file];
			if (!isFileInCodePanes2) {
				const codePaneFile = {
					paneID: `#split-${file?.name}-${file?.type}-${file?.id}`,
					label: file?.name,
					fileId: file?.id,
					fileName: file?.name,
					source: file?.content,
					type: file?.type,
					openInNewPane: false,
					softSelected: true
				};
				$codePanes2 = [...$codePanes2, codePaneFile];
			}
		}
		softSelectedFileId.set(file.id);
		focusedFileId.set(file.id);
		clearSplit.set(true);
	}

	$: codePaneData = {};

	$: $codePanes2,
		(codePaneData = (() => {
			if (!$derivedCodeData?.fileId) return;
			if (!$derivedCodeData?.fileName) return;
			if (!$derivedCodeData?.type) return;

			let newPanes = [...$codePanes2];

			if (!$openFiles?.some((openFile) => openFile.id === $derivedCodeData?.fileId)) {
				newPanes = [];
			}

			const pane =
				{
					paneID: `#split-${$derivedCodeData?.fileName}-${$derivedCodeData?.type}-${$derivedCodeData?.fileId}`,
					label: $derivedCodeData?.fileName,
					...$derivedCodeData
				} ?? {};

			const isPaneAlreadyOpen = newPanes.includes(pane?.paneID);

			const generatedPaneData = {
				pane: isPaneAlreadyOpen ? pane.paneID : null,
				...$derivedCodeData
			};

			if ($derivedCodeData?.openInNewPane && !isPaneAlreadyOpen) {
				if (newPanes.length < 3) {
					// If there's room, add the new pane
					newPanes = [...newPanes, pane];
					generatedPaneData.pane = pane.pandID;
				} else {
					// If no room, remove the oldest pane and add the new one
					const [, ...restOfPanes] = newPanes;
					newPanes = restOfPanes;
					newPanes = [...newPanes, pane];
					generatedPaneData.pane = pane.paneID;
				}
				// Update the codePanes store
				codePanes2.set(newPanes);
			} else if (!generatedPaneData.pane) {
				// If not opening in a new pane, set the default pane
				generatedPaneData.pane = `#split-${$derivedCodeData.type}`;
			} else if (isPaneAlreadyOpen && $openFiles?.length > 1 && !$derivedCodeData?.openInNewPane) {
				// If the pane is already open, set the pane to the existing pane
				generatedPaneData.pane = pane.paneID;
			}

			openInNewPane.set(false);
			generatedPaneData.openInNewPane = false;
			return generatedPaneData;
		})());

	// Handle Right Click on File (Open Context Menu for File, options include "open in new pane", "delete", "save")
	function handleRightClick(e, file) {
		e.preventDefault();

		// Remove any existing context menus
		const existingMenus = document.querySelectorAll('.context-menu');
		existingMenus.forEach((menu) => menu.remove());

		// Create context menu
		const contextMenu = document.createElement('div');
		contextMenu.classList.add('context-menu');

		// Coordinates for the menu
		const { clientX: x, clientY: y } = e;

		// Menu items
		const items = [
			{ label: 'Open in New Pane', action: () => openNewPane(file) },
			{ label: 'Delete', action: () => deleteFile(file) },
			{ label: 'Save', action: () => saveFile(file) }
		];

		// Populate menu items
		items.forEach((item) => {
			const menuItem = document.createElement('button');
			menuItem.innerText = item.label;
			menuItem.addEventListener('click', () => {
				item.action();
				// Remove context menu after action
				contextMenu.remove();
			});
			contextMenu.appendChild(menuItem);
		});

		// Position menu at click coordinates
		contextMenu.style.position = 'absolute';
		contextMenu.style.left = `${x}px`;
		contextMenu.style.top = `${y}px`;

		// Append to body and remove on next click anywhere
		document.body.appendChild(contextMenu);
		document.addEventListener('click', function cleanup() {
			contextMenu.remove();
			document.removeEventListener('click', cleanup);
		});
	}

	// Placeholder functions for actions
	function openNewPane(file) {
		// Add your logic to open file in new pane
		handleFileDBClick(file);
		openInNewPane.set(true);
	}

	function deleteFile(file) {
		// Add your logic to delete the file
	}

	function saveFile(file) {
		// Add your logic to save the file
	}

	function buildItemThreads(parentId, items) {
		const threads = [];

		for (const item of items) {
			if (item.parentFileId === parentId) {
				const children = buildItemThreads(item.id, items);
				threads.push({
					...item,
					children
				});
			}
		}

		return threads;
	}

	function toggleFolder(id) {
		$fileSystemExpanderStore[id] = !$fileSystemExpanderStore[id];
		fileSystemExpanderStore.set($fileSystemExpanderStore);
		tick();
	}

	$: threadedFiles = buildItemThreads(parentFileId, files);

	onMount(() => {
		/**
		 * check if gameId matches the current game id in the store.
		 *
		 * This persists the store and then wipes it ONLY if the user visits a new game.
		 *
		 */
		if ($fileSystemMetaDataStore?.gameId !== reactiveGameId) {
			fileSystemExpanderStore.set({});
			fileSystemMetaDataStore.set({
				gameId: reactiveGameId,
				userId: reactiveUserId
			});
			openFiles.set([]);
			focusedFileId.set(null);
			softSelectedFileId.set(null);
		}
	});
</script>

<ul class="file-tree">
	{#each threadedFiles as file}
		<li class="file-item">
			{#if file.type === 'folder'}
				<button
					class="folder-button"
					class:expanded={$fileSystemExpanderStore[file.id]}
					on:click={() => toggleFolder(file.id)}
				>
					{file.name}
				</button>
			{:else}
				<button
					class="file-button"
					on:click={() => HandleFileSingleClick(file)}
					on:dblclick={() => handleFileDBClick(file)}
					on:contextmenu={(e) => handleRightClick(e, file)}
				>
					<File {file} />
				</button>
			{/if}
			{#if $fileSystemExpanderStore[file.id] && file.children && file.children.length > 0}
				<ul class="nested">
					<svelte:self
						{files}
						parentFileId={file.id}
						gameId={reactiveGameId}
						userId={reactiveUserId}
					/>
				</ul>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.file-tree,
	.nested {
		list-style: none;
		padding: 0;
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.nested {
		padding-left: 16px;
	}

	.file-item {
		padding: 2px 0;
		color: #ccc;
		position: relative;
	}

	.file-button {
		background: none;
		border: none;
		font-size: 13px;
		cursor: pointer;
	}

	.folder-button {
		background: none;
		border: none;
		color: #ccc;
		font-size: 13px;
		cursor: pointer;
		padding-left: 20px;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 16px;
		background-image: none;
	}

	.folder-button::before {
		content: '>';
		position: absolute;
		left: 0;
		top: 14px;
		transform: translateY(-50%);
		font-size: larger;
	}

	.folder-button.expanded::before {
		content: 'v';
	}

	.folder-button:hover {
		color: #fff;
	}
	:global(button):hover {
		cursor: pointer;
	}
</style>
