<script>
	// @ts-nocheck
	import {
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		openFiles,
		focusedFileId,
		softSelectedFileId,
		renameFile
	} from '$lib/stores/filesStore.js';
	import { themeDataStore } from '$lib/stores/themeStore';

	export let preventOpen = false;
	export let allFiles;
	export let file;
	export let isRenaming = false;
	export let editingId = null;

	let fullFileName = `${file.name}.${file.type}`;

	async function handleFileUpdate(fileToUpdate) {
		await fetch(`/api/updateFile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fileId: fileToUpdate?.id,
				gameId: file?.game_id ?? file?.gameId,
				name: fileToUpdate?.name,
				type: fileToUpdate?.type,
				content: fileToUpdate?.content,
				parentFileId: fileToUpdate?.parentFileId
			})
		});
	}

	$: isSoftSelected = file?.id === $softSelectedFileId;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: file,
		(() => {
			const extractedFile = allFiles?.filter((f) => f.id === file.id)[0];
		})();
</script>

<div class="file-line" style={`${themeString}`}>
	{#if isRenaming && editingId === file.id}
		<input
			type="text"
			bind:value={fullFileName}
			on:blur={() => {
				const [name, type] = fullFileName.split('.');
				const fileToUpdate = renameFile(file.id, name, type ?? 'folder', allFiles);
				console.log('fileToUpdate::', fileToUpdate);
				handleFileUpdate(fileToUpdate);

				isRenaming = false;
				editingId = null;
				fullFileName = '';
				preventOpen = false;
			}}
		/>
	{:else}
		<span class:isSoftSelected>{file.name}.{file.type}</span>
	{/if}
</div>

<style>
	span.isSoftSelected {
		font-style: italic;
	}
	.file-line {
		color: var(--folder-button-color);
		padding-left: 20px;
		font-size: 13px;
	}
	.file-line:hover {
		color: var(--text-color-highlight);
		cursor: pointer;
	}
</style>
