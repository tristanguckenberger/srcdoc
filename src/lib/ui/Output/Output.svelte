<script>
	// @ts-nocheck

	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { fileStoreFiles, derivedFileSystemData, baseDataStore } from '$lib/stores/filesStore.js';
	import { editorOutContainerWidth, editorOutContainerHeight } from '$lib/stores/layoutStore';
	import { gameControllerStore } from '$lib/stores/gameControllerStore';
	import { browser } from '$app/environment';

	export let relaxed = false;
	export let play = false;

	let id = 0;
	let iframe;
	let rootFileId;

	$: {
		(async () => {
			// Automatically find the ID of the file named 'index' with type 'html'
			const gameName = $baseDataStore?.title;
			const joinedGameName = gameName.split(' ').join('_');
			const rootFile = await $fileStoreFiles?.find((file) => {
				return (
					(file.name === 'root' ||
						file.name.trim() === joinedGameName.trim() ||
						file.name === gameName) &&
					file.type === 'folder'
				);
			});

			if (rootFile) {
				rootFileId = rootFile.id;
			} else {
				console.log('No root file found! Please create a file named "index.html" and try again.');
			}
		})();
	}

	$: srcdoc = buildDynamicSrcDoc(
		$fileStoreFiles,
		rootFileId,
		{
			width: $editorOutContainerWidth,
			height: $editorOutContainerHeight
		},
		$gameControllerStore
	);

	afterUpdate(() => {
		if (rootFileId) {
			srcdoc = buildDynamicSrcDoc(
				$fileStoreFiles,
				rootFileId,
				{
					width: $editorOutContainerWidth,
					height: $editorOutContainerHeight
				},
				$gameControllerStore
			);
			const blob = new Blob([srcdoc], { type: 'text/html' });
			const blobUrl = URL.createObjectURL(blob);
			try {
				iframe.src = blobUrl;
			} catch (error) {
				console.log('error::', error);
			}

			id++;
		}
	});

	function receiveMessage(event) {
		// Check for the right message type and possibly origin for security
		if (event.origin === 'http://127.0.0.1:5173' && event.data.type === 'updateStore') {
			gameControllerStore.set(event.data.value);
		}
	}

	onMount(() => {
		if (browser) window.addEventListener('message', receiveMessage);
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('message', receiveMessage);
	});

	let clientWidth = 0;
	let clientHeight = 0;

	$: {
		if (play) {
			$editorOutContainerHeight = clientHeight;
			$editorOutContainerWidth = clientWidth;

			fileStoreFiles.set($derivedFileSystemData);
		}
	}
</script>

<div style="height: 100%; flex-grow: 1;" bind:clientWidth bind:clientHeight>
	<iframe
		id={`output-iframe-${id}`}
		style="border-radius: 6px; -webkit-mask-image: -webkit-radial-gradient(white, black);"
		title="result"
		bind:this={iframe}
		sandbox={[
			'allow-popups-to-escape-sandbox',
			'allow-scripts',
			'allow-popups',
			'allow-forms',
			'allow-pointer-lock',
			'allow-top-navigation',
			'allow-modals',
			relaxed ? 'allow-same-origin' : ''
		].join(' ')}
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
