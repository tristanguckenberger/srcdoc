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

	export let preventOpen = false;
	export let allFiles;
	export let file;
	export let isRenaming = false;
	export let editingId = null;

	let fullFileName = `${file.name}.${file.type}`;
	$: isSoftSelected = file?.id === $softSelectedFileId;
</script>

<div class="file-line">
	{#if isRenaming && editingId === file.id}
		<input
			type="text"
			bind:value={fullFileName}
			on:blur={() => {
				const [name, type] = fullFileName.split('.');
				renameFile(file.id, name, type ?? 'folder', allFiles);
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
		color: #ccc;
		padding-left: 20px;
		font-size: 13px;
	}
	.file-line:hover {
		color: #fff;
		cursor: pointer;
	}
</style>
