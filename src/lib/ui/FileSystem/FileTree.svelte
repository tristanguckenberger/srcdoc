<script>
	// @ts-nocheck
	import File from './File.svelte';
	import {
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		openFiles,
		focusedFileId,
		softSelectedFileId
	} from '$lib/stores/filesStore.js';
	import { onMount } from 'svelte';

	export let gameId;
	export let userId;
	export let files;
	export let parentFileId;

	$: reactiveGameId = gameId;
	$: reactiveUserId = userId;

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
		/* font-weight: bold; */
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
</style>
