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
		derivedCodeData,
		previouslyFocusedFileId,
		createFile,
		fileStoreFiles,
		baseDataStore,
		deleteFiles,
		renameFile,
		base64ToBlob,
		autoCompile,
		triggerCompile,
		firstRun
	} from '$lib/stores/filesStore.js';
	import { clearSplit } from '$lib/stores/splitStore';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';

	export let gameId;
	export let userId;
	export let files;
	export let parentFileId;

	let preventOpen = false;
	let creatingFile = false;
	let newFileName = '';
	let newFileParent = null;
	let threadedFiles = buildItemThreads(parentFileId, files);
	let isRenaming = false;
	let editingId = null;
	let fullFileName = '';
	let folderName = '';

	$: reactiveGameId = gameId;
	$: reactiveUserId = userId;

	function startCreatingFile(file) {
		creatingFile = true;
		newFileParent = file;
		// TODO: focus on the input element
	}

	function confirmFileCreation() {
		createFile(newFileName, newFileParent, files);
		creatingFile = false;
		newFileName = '';
		newFileParent = null;
	}

	function cancelFileCreation() {
		creatingFile = false;
		newFileName = '';
	}

	function handleFileDBClick(file) {
		if (!$openFiles?.some((openFile) => openFile.id === file.id) && file.type !== 'folder') {
			$openFiles = [...$openFiles, file];
		}

		if ($softSelectedFileId === file.id) {
			softSelectedFileId.set(null);
		}

		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(file.id);
		// if ($autoCompile) {
		clearSplit.set(true);
		// }
	}

	// Handle File Single Click
	async function HandleFileSingleClick(file) {
		if (preventOpen) return;
		const isFileAlreadyOpen = $openFiles?.some((openFile) => openFile.id === file.id);

		// If the clicked file is already open and not soft-selected, focus it and return.
		if (isFileAlreadyOpen && $softSelectedFileId !== file.id) {
			previouslyFocusedFileId.set($focusedFileId);
			focusedFileId.set(file.id);
			// if ($autoCompile) {
			clearSplit.set(true);
			// }
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
		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(file.id);
		// if ($autoCompile) {
		triggerCompile.set(true);
		// }
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

	const reader = (file) =>
		new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = () => resolve(fr);
			fr.onerror = (err) => reject(err);
			fr.readAsDataURL(file);
		});

	async function parseFilesData(fileList) {
		const frPromises = fileList.map((file) =>
			reader(file).then((fr) => {
				return {
					name: file.name,
					content: fr.result
				};
			})
		);

		try {
			return Promise.all(frPromises);
		} catch (err) {
			// In this specific case, Promise.all() might be preferred
			// over Promise.allSettled(), since it isn't trivial to modify
			// a FileList to a subset of files of what the user initially
			// selected. Therefore, let's just stash the entire operation.
			console.error(err);
			return;
		}
	}

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
		let items =
			file?.type === 'folder'
				? [
						{ label: 'New File...', action: () => startCreatingFile(file) },
						{ label: 'New Folder...', action: () => startCreatingFile(file) },
						{
							label: 'Rename...',
							action: () => {
								isRenaming = true;
								editingId = file.id;
								preventOpen = true;
								folderName = file.name;
							}
						},
						{ label: 'Delete', action: () => deleteFile(file) }
				  ]
				: [
						{ label: 'Open in New Pane', action: () => openNewPane(file) },
						{
							label: 'Rename...',
							action: () => {
								isRenaming = true;
								editingId = file.id;
								preventOpen = true;
							}
						},
						{ label: 'Delete', action: () => deleteFile(file) },
						{ label: 'Save', action: () => saveFile(file) }
				  ];

		if (file.name === 'assets') {
			// Create a hidden file input element for file upload
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
			fileInput.multiple = true;
			fileInput.bind = { this: fileInput };
			fileInput.style.display = 'none';
			fileInput.addEventListener('change', async (event) => {
				if (!event.target.files) return;

				const parsedFiles = await parseFilesData([...event.target.files]);
				parsedFiles.forEach((fileData) => {
					const dataString = JSON.stringify(fileData?.content);
					createFile(fileData.name, file, files, dataString);
				});
			});

			// Add the file input to the body (or somewhere else in your DOM)
			document.body.appendChild(fileInput);

			// Add the "Upload Asset" menu item
			items = [
				...items,
				{
					label: 'Upload Asset',
					action: () => {
						// Trigger the hidden file input when this menu item is clicked
						fileInput.click();
					}
				}
			];
		}

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

	// function createFile(rootFile) {}

	function deleteFile(file) {
		// Add your logic to delete the file
		deleteFiles(file?.id, files);
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
					children,
					isExpanded: $fileSystemExpanderStore[item.id] ?? false
				});
			}
		}

		return threads;
	}

	function toggleFolder({ id }, file) {
		$fileSystemExpanderStore[id] = !$fileSystemExpanderStore[id];
		fileSystemExpanderStore.set($fileSystemExpanderStore);
		tick();
	}

	// We want to automatically thread the files when the files change (aka when a new file is created or a file is deleted)
	$: $fileStoreFiles && $fileStoreFiles?.length > 0,
		(() => {
			if ($fileStoreFiles?.length > 0) {
				threadedFiles = buildItemThreads(parentFileId, $fileStoreFiles);
				files = $fileStoreFiles;
			}
		})();

	afterUpdate(() => {
		if (threadedFiles?.length > 0 && $firstRun) {
			files.forEach((file) => {
				if (file.type === 'folder') {
					$fileSystemExpanderStore[file.id] = true;
				}
			});
			fileSystemExpanderStore.set($fileSystemExpanderStore);
			setTimeout(() => {
				$firstRun = false;
			}, 50);
			firstRun.set(false);
		}
	});

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

		if (files /** && timeout === false*/) {
			fileStoreFiles.set(files);
		}
	});
</script>

<ul class="file-tree">
	{#await threadedFiles then threads}
		{#each threads as file (file.id)}
			<li class="file-item">
				{#if file.type === 'folder'}
					{#if isRenaming && editingId === file.id}
						<input
							type="text"
							bind:value={folderName}
							on:blur={() => {
								renameFile(file.id, folderName, 'folder', files);
								isRenaming = false;
								editingId = null;
								folderName = '';
								preventOpen = false;
							}}
						/>
					{:else}
						<button
							class="folder-button"
							class:expanded={$fileSystemExpanderStore[file.id]}
							on:click={() => {
								toggleFolder(file);
							}}
							on:contextmenu={(e) => handleRightClick(e, file)}
						>
							{file.name}
						</button>
					{/if}
				{:else}
					<button
						class="file-button"
						on:click={() => HandleFileSingleClick(file)}
						on:dblclick={() => handleFileDBClick(file)}
						on:contextmenu={(e) => handleRightClick(e, file)}
					>
						<File {file} bind:isRenaming bind:editingId allFiles={files} bind:preventOpen />
					</button>
				{/if}

				{#if creatingFile && newFileParent.id === file.id}
					<div class="newFileInput">
						<input type="text" bind:value={newFileName} />
						<button on:click={confirmFileCreation}>Done</button>
						<button on:click={cancelFileCreation}>Cancel</button>
					</div>
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
	{/await}
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
		padding: 0;
		color: var(--folder-button-color);
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
		color: var(--folder-button-color);
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
		top: 12px;
		transform: translateY(-50%);
		font-size: larger;
	}

	.folder-button.expanded::before {
		content: 'v';
	}

	.folder-button:hover {
		color: var(--text-color-highlight);
	}
	:global(button):hover {
		cursor: pointer;
	}
</style>
