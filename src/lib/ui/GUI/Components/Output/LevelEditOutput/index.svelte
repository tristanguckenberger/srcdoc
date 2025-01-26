<script>
	// @ts-nocheck
	// import buildDynamicSrcDoc from '$lib/srcdoc.js';
	// Run screens in edit mode
	import {
		buildDynamicSrcDoc,
		getBaseFiles,
		generateClassFileFromJSON
	} from '$lib/utils/gui/compilation/edit_srcdoc.svelte.ts';
	import { onDestroy, onMount, tick, untrack } from 'svelte';
	import { src_build, currentGame, screenshot } from '$lib/stores/gamesStore';
	import {
		fileStoreFiles,
		derivedFileSystemData,
		baseDataStore,
		triggerCompile,
		autoCompile
	} from '$lib/stores/filesStore.js';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isDragging
	} from '$lib/stores/layoutStore';
	import { gameControllerStore } from '$lib/stores/gameControllerStore';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { debounce } from 'lodash-es';
	import { playButton } from '$lib/stores/gamesStore';
	import LoadingIndicator from '$lib/ui/LoadingIndicator/index.svelte';
	import OutputLoader from '$lib/ui/LoadingIndicator/OutputLoader.svelte';

	import * as htmlToImage from 'html-to-image';
	import { writable } from 'svelte/store';
	import { gameSession } from '$lib/stores/gameSession/index.js';

	let { relaxed = false, play = false, srcdocBuilt } = $props();

	const gameSessionState = writable(null);
	const gameSessionScore = writable(0);

	let id = $state(0);
	let iframe = $state(null);
	let rebuild = $state(false);
	let clientWidth = $state(0);
	let clientHeight = $state(0);
	let thumbnail = $state('');
	let stopPropagation = $state(false);
	let iframe_srcdoc = $state(null);
	let triggerUpdate = $state(false);
	let updatingIframe = $state(false);
	let rootFileId = $derived.by(() => {
		const gameName = $baseDataStore?.title;

		const joinedGameName = gameName?.split(' ').join('_');
		const rootFile = $fileStoreFiles?.find((file) => {
			return (
				(file.name === 'root' ||
					file.name.trim() === joinedGameName.trim() ||
					file.name === gameName) &&
				file.type === 'folder'
			);
		});

		if (rootFile) {
			return rootFile.id;
		}
	});
	let dimensions = $derived({
		clientWidth,
		clientHeight,
		editorOutContainerWidth: $editorOutContainerWidth,
		editorOutContainerHeight: $editorOutContainerHeight
	});

	let loading = $derived.by(() => {
		return updatingIframe || $isDragging;
	});

	function buildSRCDOC() {
		if (rootFileId || (($triggerCompile || $autoCompile) && rootFileId) || rebuild) {
			return buildDynamicSrcDoc(
				$fileStoreFiles,
				rootFileId,
				{
					width: $editorOutContainerWidth,
					height: $editorOutContainerHeight
				},
				$gameControllerStore
			);
		}
	}

	let srcdoc = $derived.by(() => {
		if (rootFileId || (($triggerCompile || $autoCompile) && rootFileId) || rebuild) {
			untrack(() => {
				return buildDynamicSrcDoc(
					$fileStoreFiles,
					rootFileId,
					{
						width: $editorOutContainerWidth,
						height: $editorOutContainerHeight
					},
					$gameControllerStore
				);
			});
		}
	});

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

	let blob = $derived.by(() => {
		if (iframe_srcdoc) {
			return new Blob([iframe_srcdoc], { type: 'text/html' });
		}
	});
	let blobUrl = $derived.by(() => {
		if (blob) {
			return URL.createObjectURL(blob);
		}
	});

	$effect(async () => {
		// if (loading) return;
		if ($baseDataStore?.files && $fileStoreFiles === null) {
			updatingIframe = true;
			untrack(() => fileStoreFiles.set($baseDataStore?.files));
		}
		untrack(() => {
			if (srcdoc) {
				iframe_srcdoc = srcdoc;
			}
		});

		if (!$isDragging && iframe) {
			if (blobUrl && iframe?.src !== blobUrl) {
				updatingIframe = true;
				untrack(() => {
					iframe.src = blobUrl;
					id++;
				});
			}
		}

		if (!$editorOutContainerHeight || !$editorOutContainerWidth) {
			untrack(() => {
				$editorOutContainerHeight = clientHeight;
				$editorOutContainerWidth = clientWidth;
			});
		}

		if ($triggerCompile) {
			untrack(() => {
				handleReload();
			});
		}
	});

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
		if (
			e.origin === 'http://localhost:5173' ||
			e.origin === 'http://127.0.0.1:5173' ||
			e.origin === 'https://playengine.xyz' ||
			e.origin === 'null'
		) {
			switch (e.data.event) {
				case 'start-game':
					await gameInit();
					break;
				case 'update-score':
					const score = e?.data?.value;
					$gameSessionScore = score;
					break;
				case 'stop-game':
					await tick();
					if ($gameSessionState?.id && !stopPropagation) {
						stopPropagation = true;
						await addGameSessionActivity($gameSessionState?.id, 'Stop');

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
					break;
				default:
					break;
			}
		}
	}

	const debouncedResize = debounce(() => {
		let prevID = id;
		$editorOutContainerWidth = clientWidth;
		$editorOutContainerHeight = clientHeight;
		if (rootFileId) {
			let srcdoc = buildDynamicSrcDoc(
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

			if (blobUrl && iframe?.src !== blobUrl) {
				iframe.src = blobUrl;
				id++;
			}
		}
	}, 200);

	function handleReload() {
		let prevID = id;
		if (rootFileId) {
			let srcdoc = buildDynamicSrcDoc(
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

			if (blobUrl && iframe?.src !== blobUrl) {
				updatingIframe = true;
				iframe.src = blobUrl;
				id++;
			}

			triggerCompile.set(false);
		}
	}

	function handleResize(node) {
		$effect(() => {
			if ($editorOutContainerWidth !== clientWidth && !$isDragging) {
				updatingIframe = true;
				debouncedResize();
			}
		});
	}

	onMount(() => {
		if (browser) window.addEventListener('message', receiveMessage);
		$autoCompile = false;

		if ($baseDataStore?.files) fileStoreFiles.set($baseDataStore?.files);

		iframe?.addEventListener('load', () => {
			updatingIframe = false;
		});
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('message', receiveMessage);
		stopPropagation = false;

		fileStoreFiles.set(null);
		baseDataStore.set([]);
		iframe?.removeEventListener('load', () => {
			updatingIframe = false;
		});
	});
</script>

<div style="height: 100%; flex-grow: 1;" bind:clientWidth bind:clientHeight use:handleResize>
	{#if loading}
		<OutputLoader hide={!loading} />
	{/if}
	<iframe
		id={`output-iframe-${id}`}
		class={{ hide: loading }}
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
	></iframe>
</div>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	iframe.hide {
		position: relative;
		z-index: -1;
		/* display: none; */
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
