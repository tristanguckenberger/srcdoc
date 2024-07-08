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
	import { page } from '$app/stores';
	import { debounce } from 'lodash-es';
	import { playButton } from '$lib/stores/gamesStore';

	import * as htmlToImage from 'html-to-image';
	import { writable } from 'svelte/store';
	import { gameSession } from '$lib/stores/gameSession/index.js';

	export let relaxed = false;
	export let play = false;
	export let srcdocBuilt;

	// const gameSession = writable({});
	const gameSessionState = writable(null);
	const gameSessionScore = writable(0);

	let id = 0;
	let iframe;
	let srcdoc;
	let rootFileId;
	let thumbnail;
	let temporarySessionState = null;
	let stopPropagation = false;

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
				$triggerCompile = false;
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

	const debouncedAfterUpdate = debounce(async () => {
		$autoCompile = false;
		if ((rootFileId && ($triggerCompile || $autoCompile || triggerUpdate)) || play) {
			console.log('After update triggered');
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
				console.log('Compile and update flags reset');
			}, 800);
		}
	}, 400);

	afterUpdate(debouncedAfterUpdate);

	const gameInit = async () => {
		try {
			const response = await fetch(`/api/games/sessions/createGameSession/${$page.params.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				mode: 'cors'
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const jsonBody = await response.json();

			if (jsonBody?.game_session_id) {
				$gameSessionState = { id: jsonBody?.game_session_id }; // Use temporary variable
				await addGameSessionActivity($gameSessionState?.id, 'Start');
			} else {
				throw new Error('Invalid response body');
			}
		} catch (error) {
			console.error('Failed to initialize game session:', error);
		}
	};

	async function receiveMessage(e) {
		console.log(`Received message from ${e.origin}:`, e.data);

		if (
			e.origin === 'http://localhost:5173' ||
			e.origin === 'http://127.0.0.1:5173' ||
			e.origin === 'https://playengine.xyz' ||
			e.origin === 'null'
		) {
			console.log('output::', e.data.event);
			switch (e.data.event) {
				case 'start-game':
					console.log('Starting game...');
					await gameInit();
					console.log('Game started');
					break;
				case 'update-score':
					const score = e?.data?.value;
					console.log('Updating score:', score);
					$gameSessionScore = score;
					break;
				case 'stop-game':
					console.log('Stopping game...');
					await tick();
					if ($gameSessionState?.id && !stopPropagation) {
						stopPropagation = true;
						await addGameSessionActivity($gameSessionState?.id, 'Stop');
						console.log('::::::::::::Game session activity stop added::::::::::::');
						await fetch(`/api/games/sessions/updateGameSession/${$gameSessionState?.id}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								sessionTotalScore: $gameSessionScore
							})
						}).then((response) => {
							if (response.ok) {
								console.log('Game session ended');
								$playButton = false;
							} else {
								console.error('Failed to update game session');
							}
						});

						$triggerCompile = true;
						triggerUpdate = true;

						setTimeout(() => {
							$triggerCompile = false;
						}, 500);
					}

					break;
				case 'gameresume':
					console.log('Resuming game...');
					break;
				default:
					console.log('Unknown event:', e.data.event);
					break;
			}
		}
	}

	onMount(() => {
		if (browser) window.addEventListener('message', receiveMessage);
		$autoCompile = false;
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('message', receiveMessage);
		stopPropagation = false;
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
