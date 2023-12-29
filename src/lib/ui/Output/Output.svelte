<script>
	// @ts-nocheck

	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { src_build } from '$lib/stores/gamesStore';
	import {
		fileStoreFiles,
		derivedFileSystemData,
		baseDataStore,
		triggerCompile,
		autoCompile
	} from '$lib/stores/filesStore.js';
	import { editorOutContainerWidth, editorOutContainerHeight } from '$lib/stores/layoutStore';
	import { gameControllerStore } from '$lib/stores/gameControllerStore';
	import { browser } from '$app/environment';

	export let relaxed = false;
	export let play = false;
	export let srcdocBuilt;

	let id = 0;
	let iframe;
	let srcdoc;
	let rootFileId;

	$: {
		// console.log('$fileStoreFiles::', $fileStoreFiles);
		(async () => {
			// Automatically find the ID of the file named 'index' with type 'html'
			const gameName = $baseDataStore?.title;
			const joinedGameName = gameName?.split(' ').join('_');
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

	$: {
		if (rootFileId && ($triggerCompile || $autoCompile)) {
			// console.log('$fileStoreFiles::', $fileStoreFiles);
			// console.log('rootFileId::', rootFileId);
			// console.log('width::', $editorOutContainerWidth);
			// console.log('height::', $editorOutContainerHeight);
			// console.log('gameControllerStore::', $gameControllerStore);
			srcdoc =
				$src_build ||
				buildDynamicSrcDoc(
					$fileStoreFiles,
					rootFileId,
					{
						width: $editorOutContainerWidth,
						height: $editorOutContainerHeight
					},
					$gameControllerStore
				);
			setTimeout(() => {
				triggerCompile.set(false);
			}, 400);
		}
	}

	let triggerUpdate = false;

	$: $editorOutContainerHeight,
		$editorOutContainerWidth,
		(() => {
			triggerUpdate = true;
		})();

	afterUpdate(async () => {
		if ((rootFileId && ($triggerCompile || $autoCompile || triggerUpdate)) || play || srcdocBuilt) {
			srcdoc =
				$src_build ||
				buildDynamicSrcDoc(
					$fileStoreFiles,
					rootFileId,
					{
						width: $editorOutContainerWidth,
						height: $editorOutContainerHeight
					},
					$gameControllerStore
				);
			const blob = new Blob([srcdocBuilt ?? srcdoc], { type: 'text/html' });
			const blobUrl = URL.createObjectURL(blob);
			iframe.src = blobUrl;
			id++;
			setTimeout(() => {
				triggerCompile.set(false);
				triggerUpdate = false;
				play = false;
			}, 400);
		}
	});

	function receiveMessage(event) {
		// console.log('event::', event);
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

	// $: console.log('srcdoc::', srcdoc);
	// $: console.log('src_build::', $src_build);
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
