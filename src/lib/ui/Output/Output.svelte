<script>
	// @ts-nocheck

	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { src_build, currentGame, screenshot } from '$lib/stores/gamesStore';
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

	import * as htmlToImage from 'html-to-image';
	import {
		gameSession,
		gameSessionState,
		gameSessionScore
	} from '$lib/stores/gameSession/index.js';

	export let relaxed = false;
	export let play = false;
	export let srcdocBuilt;

	let id = 0;
	let iframe;
	let srcdoc;
	let rootFileId;
	let thumbnail;

	$: {
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

	/**
	 * Add game session activity
	 * @param {string} gameSessionId
	 * @param {string} action - start, stop, resume, pause
	 * @returns {Promise<void>}
	 */
	const addGameSessionActivity = async (gameSessionId, action) => {
		const addActivity = fetch(
			`/api/games/sessions/${gameSessionId}/activities/createNewGameSessionActivity`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				body: JSON.stringify({
					action
				})
			}
		);

		const addActivityJSON = await addActivity;
		const addActivityData = await addActivityJSON.json();
	};

	afterUpdate(async () => {
		if ((rootFileId && ($triggerCompile || $autoCompile || triggerUpdate)) || play) {
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
			const blob = new Blob([srcdoc], { type: 'text/html' });
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

	async function receiveMessage(e) {
		console.log(`Received message from ${e.origin}:`, e.data);

		if (
			e.origin === 'http://localhost:5173' ||
			e.origin === 'http://127.0.0.1:5173' ||
			e.origin === 'https://playengine.srcdoc.io' ||
			e.origin === 'null'
		) {
			switch (e.data.event) {
				case 'start-game':
					try {
						await tick();
						if ($gameSessionState?.id) {
							await addGameSessionActivity($gameSessionState?.id, 'Start');
						}
					} catch (error) {
						console.log('error::', error);
					}
					break;
				case 'update-score':
					// Get score to add
					const score = e?.data?.value;
					console.log('score::', score);

					// if we have a session and a score, update the session with the summation of the user's existing score and the added score
					if (score) {
						await tick();
						gameSessionScore.set(score);
						console.log('gameSessionScore::', $gameSessionScore);
					}

					break;
				case 'gamepause':
					// gameControllerStore.set('paused');
					break;
				case 'gameresume':
					// gameControllerStore.set('running');
					break;
				default:
					break;
			}
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

	$: (() => {
		if ($screenshot) {
			relaxed = true;
			setTimeout(() => {
				try {
					let doc = iframe?.contentDocument;
					htmlToImage.toPng(doc?.body).then(function (dataUrl) {
						thumbnail = dataUrl;
					});
					relaxed = false;
					$screenshot = false;
				} catch (error) {
					console.log('error:;', error);
				}
			}, 1000);
		}
	})();
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
	@media (max-width: 498px) {
		iframe {
			border-radius: 0px !important;
		}
		:global(#editor-layout.engineInRoute) iframe {
			border-radius: 6px !important;
		}
	}
</style>
