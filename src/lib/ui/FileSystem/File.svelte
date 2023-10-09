<script>
	// @ts-nocheck
	import {
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		openFiles,
		focusedFileId,
		softSelectedFileId
	} from '$lib/stores/filesStore.js';

	export let file;
	$: isSoftSelected = file?.id === $softSelectedFileId;
</script>

<div class="file-line">
	<span class:isSoftSelected>{file.name}.{file.type}</span>
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
