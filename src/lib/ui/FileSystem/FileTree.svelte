<script>
	// @ts-nocheck
	import {
		fileSystemExpanderStore,
		fileSystemVertTraceHighlightStore,
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
		deleteFiles,
		renameFile,
		triggerCompile,
		firstRun,
		filesToUpdate,
		baseDataStore,
		initialDataStore,
		focusedFolderId
	} from '$lib/stores/filesStore.js';
	import { clearSplit } from '$lib/stores/splitStore';
	import { afterUpdate, onMount, tick } from 'svelte';
	import File from './File.svelte';
	import { setPointerControls, DEFAULT_DELAY } from 'svelte-gestures';

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
	let folderName = '';
	let init = true;
	let dX;
	let dY;

	function longpressHandler(event, file) {
		dX = event.detail.x;
		dY = event.detail.y;
		handleRightClick(event, file);
	}

	function longpress(node, parameters = { delay: 500 }) {
		// Default delay set to 500ms
		const gestureName = 'longpress';

		let timeout;
		let started = false;

		function onDown(activeEvents, event) {
			started = true;
			timeout = setTimeout(() => {
				if (started) {
					// Ensures the touch is still active
					const rect = node.getBoundingClientRect();
					const x = Math.round(event.clientX - rect.left);
					const y = Math.round(event.clientY - rect.top);

					node.dispatchEvent(
						new CustomEvent(gestureName, {
							detail: { x, y }
						})
					);
				}
			}, parameters.delay);
		}

		function onUp(activeEvents, event) {
			started = false;
			clearTimeout(timeout);
		}

		// Assuming `setPointerControls` is a utility function you have for adding and removing event listeners
		return setPointerControls(gestureName, node, null, onDown, onUp);
	}

	function doubletapHandler(event, file) {
		handleFileDBClick(file);
	}

	function doubletap(node, parameters = { timeframe: DEFAULT_DELAY }) {
		const gestureName = 'doubletap';
		const spread = 20;

		let startTime;
		let clientX;
		let clientY;
		let tapCount = 0;
		let timeout;

		function onUp(activeEvents, event) {
			if (
				Math.abs(event.clientX - clientX) < spread &&
				Math.abs(event.clientY - clientY) < spread &&
				Date.now() - startTime < parameters.timeframe
			) {
				if (!tapCount) {
					tapCount++;
				} else {
					const rect = node.getBoundingClientRect();
					const x = Math.round(event.clientX - rect.left);
					const y = Math.round(event.clientY - rect.top);

					node.dispatchEvent(
						new CustomEvent(gestureName, {
							detail: { x, y }
						})
					);

					clearTimeout(timeout);
					tapCount = 0;
				}
			}
		}

		function onDown(activeEvents, event) {
			if (!tapCount) {
				clientX = event.clientX;
				clientY = event.clientY;
				startTime = Date.now();
			}

			timeout = setTimeout(() => {
				tapCount = 0;
			}, parameters.timeframe);
		}

		return setPointerControls(gestureName, node, null, onDown, onUp);
	}

	function startCreatingFile(file) {
		creatingFile = true;
		newFileParent = file;
		// TODO: focus on the input element
	}
	async function confirmFileCreation() {
		const newFile = createFile(newFileName, newFileParent, files);
		creatingFile = false;
		newFileName = '';
		newFileParent = null;

		const returnedContent = await fetch(`/api/createFile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...newFile, gameId })
		})
			.then((res) => res.json())
			.then((res) => {
				if (res?.success) {
					return res?.data;
				} else {
					console.error(res?.error);
				}
			});
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
		focusedFolderId.set(null);
		// if ($autoCompile) {
		clearSplit.set(true);
		// }
	}
	async function HandleFileSingleClick(file) {
		if (preventOpen) return;
		const isFileAlreadyOpen = $openFiles?.some((openFile) => openFile.id === file.id);

		// If the clicked file is already open and not soft-selected, focus it and return.
		if (isFileAlreadyOpen && $softSelectedFileId !== file.id) {
			previouslyFocusedFileId.set($focusedFileId);
			focusedFileId.set(file.id);
			focusedFolderId.set(null);
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
		focusedFolderId.set(null);
		// if ($autoCompile) {
		triggerCompile.set(true);
		// }
	}
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
	function handleRightClick(e, file) {
		e.preventDefault();

		const existingMenus = document.querySelectorAll('.context-menu');
		existingMenus.forEach((menu) => menu.remove());

		const contextMenu = document.createElement('div');
		contextMenu.classList.add('context-menu');

		const { clientX: x, clientY: y } = e;

		let items = [];

		if (file?.type === 'folder') {
			items = [
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
			];
		} else {
			items = [
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
		}

		if (file.name === 'assets') {
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

			document.body.appendChild(fileInput);

			items = [
				...items,
				{
					label: 'Upload Asset',
					action: () => {
						fileInput.click();
					}
				}
			];
		}

		items.forEach((item) => {
			const menuItem = document.createElement('button');
			menuItem.innerText = item.label;
			menuItem.addEventListener('click', () => {
				item.action();
				contextMenu.remove();
			});
			contextMenu.appendChild(menuItem);
		});

		contextMenu.style.position = 'absolute';
		contextMenu.style.left = `${x ?? dX}px`;
		contextMenu.style.top = `${y ?? dY}px`;

		document.body.appendChild(contextMenu);
		document.addEventListener('click', function cleanup() {
			contextMenu.remove();
			document.removeEventListener('click', cleanup);
		});
	}

	function openNewPane(file) {
		handleFileDBClick(file);
		openInNewPane.set(true);
	}

	async function deleteFile(file) {
		const returnedContent = await fetch(`/api/deleteFile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ fileId: file?.id, gameId })
		})
			.then((res) => res.json())
			.then((res) => {
				if (res?.success) {
					return res?.data;
				} else {
					console.error(res?.error);
				}
			});

		deleteFiles(file?.id, files);
	}

	function saveFile(file) {
		// Add your logic to save the file
	}

	function buildItemThreads(parentId, items = []) {
		const threads = [];
		for (const item of items) {
			if ((item?.parentFileId ?? item?.parent_file_id) === parentId) {
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

	function toggleVerticalTraceHighlight(file) {
		$fileSystemVertTraceHighlightStore[file.id] = !$fileSystemVertTraceHighlightStore[file.id];
		fileSystemVertTraceHighlightStore.set($fileSystemVertTraceHighlightStore);
	}

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
		if (
			($fileSystemMetaDataStore?.gameId ?? $fileSystemMetaDataStore?.game_id) !== reactiveGameId
		) {
			fileSystemExpanderStore.set({});
			fileSystemMetaDataStore.set({
				gameId: reactiveGameId,
				userId: reactiveUserId
			});
			openFiles.set([]);
			focusedFileId.set(null);
			previouslyFocusedFileId.set(null);
			focusedFolderId.set(null);
			softSelectedFileId.set(null);
		}

		if (files) {
			fileStoreFiles.set(files);
		}

		if (init) {
			initialDataStore?.set(JSON.parse(JSON.stringify($baseDataStore)));
			init = false;
		}
	});

	let reactiveGameId = gameId;
	let reactiveUserId = userId;
	let codePaneData = {};
	$: {
		codePaneData = (() => {
			if (!$derivedCodeData?.fileId) return;
			if (!$derivedCodeData?.fileName) return;
			if (!$derivedCodeData?.type) return;

			let newPanes = [...$codePanes2];

			if (!$openFiles?.some((openFile) => openFile.id === $derivedCodeData?.fileId)) {
				newPanes = [];
			}

			const pane = {
				paneID: `#split-${$derivedCodeData?.fileName}-${$derivedCodeData?.type}-${$derivedCodeData?.fileId}`,
				label: $derivedCodeData?.fileName,
				...$derivedCodeData
			};

			const isPaneAlreadyOpen = newPanes.includes(pane?.paneID);

			const generatedPaneData = {
				pane: isPaneAlreadyOpen ? pane.paneID : null,
				...$derivedCodeData
			};

			if ($derivedCodeData?.openInNewPane && !isPaneAlreadyOpen) {
				if (newPanes.length < 3) {
					newPanes = [...newPanes, pane];
					generatedPaneData.pane = pane.pandID;
				} else {
					const [, ...restOfPanes] = newPanes;
					newPanes = restOfPanes;
					newPanes = [...newPanes, pane];
					generatedPaneData.pane = pane.paneID;
				}
				codePanes2.set(newPanes);
			} else if (!generatedPaneData.pane) {
				generatedPaneData.pane = `#split-${$derivedCodeData.type}`;
			} else if (isPaneAlreadyOpen && $openFiles?.length > 1 && !$derivedCodeData?.openInNewPane) {
				generatedPaneData.pane = pane.paneID;
			}

			openInNewPane.set(false);
			generatedPaneData.openInNewPane = false;
			return generatedPaneData;
		})();
	}

	$: {
		if ($fileStoreFiles && $fileStoreFiles?.length > 0) {
			threadedFiles = buildItemThreads(parentFileId, $fileStoreFiles);
			files = $fileStoreFiles;
		}
	}
</script>

<ul class="file-tree">
	{#await threadedFiles then threads}
		{#each threads as file (file.id)}
			<li
				class="file-item"
				class:isFile={file.type !== 'folder'}
				class:fileSelected={$focusedFileId?.toString() === file?.id?.toString()}
				on:mouseover={() => {
					toggleVerticalTraceHighlight(file);
				}}
			>
				{#if file.type !== 'folder'}
					<div
						class="highlight"
						class:fileSelected={$focusedFileId?.toString() === file?.id?.toString()}
					/>
				{/if}
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
								focusedFolderId.set(file.id);
								// focusedFileId.set(null);
							}}
							on:contextmenu={(e) => handleRightClick(e, file)}
							use:longpress
							on:longpress={(e) => longpressHandler(e, file)}
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
						use:longpress
						on:longpress={(e) => longpressHandler(e, file)}
						use:doubletap
						on:doubletap={(e) => doubletapHandler(e, file)}
					>
						<File {file} bind:isRenaming bind:editingId allFiles={files} bind:preventOpen />
					</button>
				{/if}
				<div class="vert-trace" class:expanded={$fileSystemExpanderStore[file.id]} />
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
		padding: 4px 0;
	}

	.nested {
		padding-left: 10px;
	}

	.file-item {
		border-radius: 3px;
		padding: 0;
		color: var(--folder-button-color);
		position: relative;
	}

	.file-item.isFile:hover {
		/* background-color: var(--file-selected-bg); */
	}

	.file-item.fileSelected {
		/* background-color: var(--file-selected-bg); */
	}

	.file-item.fileSelected :global(.file-button .file-line span),
	.file-item.fileSelected .folder-button {
		color: var(--text-color-highlight) !important;
	}

	.file-item.fileSelected :global(svg) {
		fill: var(--text-color-highlight) !important;
	}

	.file-button {
		background: none;
		border: none;
		font-size: 13px;
		cursor: pointer;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		font-family: 'Noto Sans', sans-serif;
		font-optical-sizing: auto;
		font-weight: var(--file-tree-weight);
		font-style: normal;
		font-variation-settings: 'wdth' var(--file-tree-weight);
		position: relative;
		z-index: 1;
	}

	.folder-button {
		background: none;
		border: none;
		color: var(--folder-button-color);
		font-size: 13px;
		cursor: pointer;
		padding-left: 15px;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 16px;
		background-image: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		height: 27px;
		font-family: 'Noto Sans', sans-serif;
		font-optical-sizing: auto;
		font-weight: var(--file-tree-weight);
		font-style: normal;
		font-variation-settings: 'wdth' var(--file-tree-weight);
		position: relative;
		z-index: 1;
	}

	.folder-button::before {
		content: '>';
		position: absolute;
		left: 0;
		top: 15px;
		transform: translateY(-50%);
		font-size: larger;
	}

	.folder-button.expanded::before {
		content: 'v';
		top: 13px;
	}

	.folder-button:hover {
		color: var(--text-color-highlight);
	}

	:global(button):hover {
		cursor: pointer;
	}
	:global(.file-tree:first-of-type) {
		padding: 0 10px !important;
	}
	.vert-trace {
		position: absolute;
		top: 24px;
		left: 2.5px;
		width: 1.5px;
		height: calc(100% - 1.2rem);
		background-color: var(--text-box-outline);
		opacity: 0;
		display: none;
		transition: opacity 0.25s ease;
	}

	.vert-trace.expanded {
		display: block;
		/* opacity: 0.3; */
	}

	.folder-button:hover + .vert-trace.expanded {
		opacity: 0.1;
	}

	.file-tree:hover .vert-trace.expanded {
		opacity: 0.5;
	}

	.file-button + .highlight:hover {
		opacity: 0.9;
	}
	.highlight {
		position: absolute;
		top: 0;
		left: -80px;
		width: calc(var(--sidebar-width) + 8px) !important;
		height: 100%;
		opacity: 0;
		transition: opacity 0.25s ease;
		background-color: var(--file-selected-bg);
	}
	.highlight:hover {
		opacity: 0.9 !important;
	}
	.file-item.isFile:hover .highlight {
		opacity: 0.9;
	}
	.highlight.fileSelected {
		opacity: 0.9;
	}
	:global(.context-menu) {
		display: flex;
		flex-direction: column;
		z-index: 10;
	}
	.newFileInput {
		padding-left: 15px;
	}
</style>
