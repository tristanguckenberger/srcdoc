<script>
	import { run } from 'svelte/legacy';

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

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [preventOpen]
	 * @property {any} allFiles
	 * @property {any} file
	 * @property {boolean} [isRenaming]
	 * @property {any} [editingId]
	 */

	/** @type {Props} */
	let {
		preventOpen = $bindable(false),
		allFiles,
		file,
		isRenaming = $bindable(false),
		editingId = $bindable(null)
	} = $props();

	let fullFileName = $state(`${file.name}.${file.type}`);

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

	let isSoftSelected = $derived(file?.id === $softSelectedFileId);
	let themeString = $derived($themeDataStore?.theme?.join(' '));
	run(() => {
		file,
			(() => {
				const extractedFile = allFiles?.filter((f) => f.id === file.id)[0];
			})();
	});
</script>

<div class="file-line" style={`${themeString}`}>
	{#if isRenaming && editingId === file.id}
		<input
			type="text"
			bind:value={fullFileName}
			onblur={() => {
				const [name, type] = fullFileName.split('.');
				const fileToUpdate = renameFile(file.id, name, type ?? 'folder', allFiles);
				handleFileUpdate(fileToUpdate);

				isRenaming = false;
				editingId = null;
				fullFileName = '';
				preventOpen = false;
			}}
		/>
	{:else}
		<div class="flexed-file-line">
			{#if file?.type === 'html'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M128,152a8,8,0,0,1-8,8h-8v48a8,8,0,0,1-16,0V160H88a8,8,0,0,1,0-16h32A8,8,0,0,1,128,152Zm-64-8a8,8,0,0,0-8,8v20H40V152a8,8,0,0,0-16,0v56a8,8,0,0,0,16,0V188H56v20a8,8,0,0,0,16,0V152A8,8,0,0,0,64,144Zm176,56H228V152a8,8,0,0,0-16,0v56a8,8,0,0,0,8,8h20a8,8,0,0,0,0-16Zm-45.86-55.71a8,8,0,0,0-9,3.59L168,176.45l-17.14-28.57A8,8,0,0,0,136,152v56a8,8,0,0,0,16,0V180.88l9.14,15.24a8,8,0,0,0,13.72,0L184,180.88V208a8,8,0,0,0,16,0V152A8,8,0,0,0,194.14,144.29ZM208,120a8,8,0,0,1-8-8V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24A8,8,0,0,1,208,120ZM188.69,80,160,51.31V80Z"
					/></svg
				>
			{:else if file?.type === 'css'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M48,180c0,11,7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,1,1,85.77,206.4,30,30,0,0,1,64,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30,30,0,0,1,21.77,9.6,8,8,0,1,1-11.55,11.06A14.24,14.24,0,0,0,64,160C55.18,160,48,169,48,180Zm79.6-8.69c-4-1.16-8.14-2.35-10.45-3.84-1.26-.81-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.73,19.83-.56a8,8,0,0,0,4.07-15.48c-2.12-.55-21-5.22-32.83,2.76a20.55,20.55,0,0,0-9,14.95c-2,15.88,13.64,20.41,23,23.11,12.07,3.49,13.13,4.92,12.78,7.59-.31,2.41-1.26,3.34-2.14,3.93-4.6,3.06-15.17,1.56-19.55.36a8,8,0,0,0-4.3,15.41,61.23,61.23,0,0,0,15.18,2c5.83,0,12.3-1,17.49-4.46a20.82,20.82,0,0,0,9.19-15.23C154,179,137.48,174.17,127.6,171.31Zm64,0c-4-1.16-8.14-2.35-10.45-3.84-1.25-.81-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.73,19.82-.56a8,8,0,0,0,4.07-15.48c-2.11-.55-21-5.22-32.83,2.76a20.58,20.58,0,0,0-8.95,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.34-2.15,3.93-4.6,3.06-15.16,1.56-19.54.36A8,8,0,0,0,173.93,214a61.34,61.34,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.81,20.81,0,0,0,9.18-15.23C218,179,201.48,174.17,191.59,171.31ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,1,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.68L160,51.31Z"
					/></svg
				>
			{:else if file?.type === 'js'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48V216H176a8,8,0,0,0,0,16h24a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160Zm-12.19,145a20.82,20.82,0,0,1-9.19,15.23C133.43,215,127,216,121.13,216a61.34,61.34,0,0,1-15.19-2,8,8,0,0,1,4.31-15.41c4.38,1.2,15,2.7,19.55-.36.88-.59,1.83-1.52,2.14-3.93.34-2.67-.71-4.1-12.78-7.59-9.35-2.7-25-7.23-23-23.11a20.56,20.56,0,0,1,9-14.95c11.84-8,30.71-3.31,32.83-2.76a8,8,0,0,1-4.07,15.48c-4.49-1.17-15.23-2.56-19.83.56a4.54,4.54,0,0,0-2,3.67c-.12.9-.14,1.09,1.11,1.9,2.31,1.49,6.45,2.68,10.45,3.84C133.49,174.17,150.05,179,147.81,196.31ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0Z"
					/></svg
				>
			{/if}
			<span class:isSoftSelected>{file.name}.{file.type}</span>
		</div>
	{/if}
</div>

<style>
	span.isSoftSelected {
		font-style: italic;
	}
	.file-line {
		color: var(--folder-button-color);
		padding-left: 20px;
		margin-left: -30px;
		font-size: 13px;
		line-height: 25px;
	}
	.file-line:hover {
		color: var(--text-color-highlight);
		cursor: pointer;
	}
	.flexed-file-line {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.flexed-file-line svg {
		fill: var(--folder-button-color);
		width: 18px;
		height: 20px;
	}

	.file-line:hover .flexed-file-line svg {
		fill: var(--text-color-highlight);
	}
</style>
