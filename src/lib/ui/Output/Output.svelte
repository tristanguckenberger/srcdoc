<script>
	// @ts-nocheck
	// import buildDoc from '$lib/srcdoc';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { htmlStore, cssStore, jsStore } from '$lib/stores/codeStore.js';
	import { afterUpdate } from 'svelte';
	import { fileStoreFiles } from '$lib/stores/filesStore.js';

	let id = 0;
	let srcdocBuilt;
	let iframe;
	let rootFileId;

	$: $fileStoreFiles,
		(() => {
			// Automatically find the ID of the file named 'index' with type 'html'
			const rootFile = $fileStoreFiles?.find((file) => {
				console.log('file::', file);
				return file.name === 'root' && file.type === 'folder';
			});
			if (rootFile) {
				rootFileId = rootFile.id;
			} else {
				console.log('No root file found! Please create a file named "index.html" and try again.');
			}
		})();

	$: console.log('rootFileId::', rootFileId);

	// $: srcdoc = buildDynamicSrcDoc($fileStoreFiles, rootFileId);
	let srcdoc = null;

	afterUpdate(() => {
		if (iframe && srcdoc) {
			// srcdocBuilt = buildDoc($htmlStore, $cssStore, $jsStore);
			iframe.srcdoc = srcdoc;
			id++;
		}
	});

	$: console.log('srcdoc::', srcdoc);
</script>

<div style="height: 100%; flex-grow: 1;">
	{#if id}
		<iframe
			id={`output-iframe-${id}`}
			style="border-radius: 6px; -webkit - mask - image: -webkit - radial - gradient(white, black);"
			title="result"
			bind:this={iframe}
			sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
		/>
	{/if}
</div>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
