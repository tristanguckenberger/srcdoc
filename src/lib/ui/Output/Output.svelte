<script>
	// @ts-nocheck
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { afterUpdate } from 'svelte';
	import { fileStoreFiles } from '$lib/stores/filesStore.js';

	let id = 0;
	let iframe;
	let rootFileId;

	$: $fileStoreFiles,
		(() => {
			// Automatically find the ID of the file named 'index' with type 'html'
			const rootFile = $fileStoreFiles?.find((file) => {
				return file.name === 'root' && file.type === 'folder';
			});

			if (rootFile) {
				rootFileId = rootFile.id;
			} else {
				console.log('No root file found! Please create a file named "index.html" and try again.');
			}
		})();

	$: srcdoc = buildDynamicSrcDoc($fileStoreFiles, rootFileId);

	afterUpdate(() => {
		if (iframe) {
			srcdoc = buildDynamicSrcDoc($fileStoreFiles, rootFileId);
			iframe.srcdoc = srcdoc;
			id++;
		}
	});
</script>

<div style="height: 100%; flex-grow: 1;">
	<iframe
		id={`output-iframe-${id}`}
		style="border-radius: 6px; -webkit - mask - image: -webkit - radial - gradient(white, black);"
		title="result"
		bind:this={iframe}
		sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
	/>
</div>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
