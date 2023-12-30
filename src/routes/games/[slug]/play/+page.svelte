<script>
	// @ts-nocheck
	import { invalidate } from '$app/navigation';
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import { goto } from '$app/navigation';
	import {
		gamesData,
		currentGame,
		topGame,
		bottomGame,
		src_build,
		playButton
	} from '$lib/stores/gamesStore.js';
	import { derived } from 'svelte/store';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		appClientWidth,
		sideBarState
	} from '$lib/stores/layoutStore';
	import {
		fileSystemSidebarWidth,
		fileSystemSidebarOpen,
		fileStoreFiles,
		focusedFileId,
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		previouslyFocusedFileId,
		softSelectedFileId,
		openFiles,
		codePanes2,
		baseDataStore,
		firstRun,
		derivedFileSystemData
	} from '$lib/stores/filesStore.js';
	import { onDestroy, onMount, tick } from 'svelte';
	import { swipe, pan, tap } from 'svelte-gestures';
	import SwipeArrow from '$lib/assets/SwipeArrow.svg';

	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';

	// Expiremental
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';

	export let data;
	export let thumbnail;

	let play;
	let direction;
	let tapRipple = false;
	let countPanTime = false;
	let pan_x;
	let pan_y;
	let last_pan_time;
	let pan_time;
	let tap_x;
	let tap_y;
	let hidden = true;
	let navActionHeight;
	let tapCenter;
	let touchCoordinatesY;
	let disableTap = false;
	let gamesAvailable = [];
	let panCoorY = pan_y;
	let panDirection;
	let panDistance = 0;

	function handlePan(event) {
		disableTap = true;
		hidden = false;
		countPanTime = true;
		pan_x = event.detail.x;
		pan_y = event.detail.y;
		last_pan_time = Date.now();

		setTimeout(() => {
			disableTap = false;
			// pan_y = null;
		}, 300);
		setTimeout(() => {
			panDistance = 0;
		}, 100);
	}
	async function handleTap(event) {
		if (disableTap) return;
		hidden = false;
		tapRipple = true;
		setTimeout(() => {
			tapRipple = false;
		}, 300);

		const { x, y } = event.detail;
		tap_x = x;
		tap_y = y;

		const tapContainerHeight = navActionHeight / 2;
		if (tap_y < navActionHeight / 2) {
			direction = 'top';
			// divide navActionHeight by 3 to the center of the top navAction and the center of the bottom navAction
			// tap_y = navActionHeight / 3;
		} else {
			direction = 'bottom';
			// tap_y = navActionHeight / 3 + navActionHeight / 2;
		}

		console.log('tap::direction::', direction);

		if (direction === 'top') {
			tapCenter = tapContainerHeight / 2 - 50;
		} else if (direction === 'bottom') {
			tapCenter = tapContainerHeight + tapContainerHeight / 2 - 50;
		}

		console.log('tapCenter::', tapCenter);

		const currentIndexByGameID = $gamesData?.findIndex(
			(game) => game?.id?.toString() === data?.id?.toString()
		);
		// check to ensure the index isnt the last in the array
		const currentIndexIsLast = $gamesData?.length - 1 === currentIndexByGameID;
		// check to ensure the index isnt the last in the array
		const currentIndexIsFirst = 0 === currentIndexByGameID;
		// try {
		// 	if (direction === 'top') {
		// 		// and then get the id of the games index + 1
		// 		const nextGame = !currentIndexIsLast
		// 			? $gamesData?.[currentIndexByGameID + 1]
		// 			: $gamesData[0];
		// 		if (nextGame?.id) {
		// 			await goto(`/games/${nextGame?.id}/play`);
		// 			await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
		// 		}
		// 	} else if (direction === 'bottom') {
		// 		const nextGame = !currentIndexIsFirst
		// 			? $gamesData[currentIndexByGameID - 1]
		// 			: $gamesData[$gamesData?.length - 1];

		// 		if (nextGame?.id) {
		// 			await goto(`/games/${nextGame?.id}/play`);
		// 			await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
		// 		}
		// 	}
		// } catch (error) {
		// 	console.log('error_handling_navigation_swipe::error::', error);
		// }
	}
	async function handler(event) {
		hidden = false;
		disableTap = true;
		countPanTime = true;
		direction = event.detail.direction;
		const currentIndexByGameID = $gamesData?.findIndex(
			(game) => game?.id?.toString() === data?.id?.toString()
		);
		const currentIndexIsLast = $gamesData?.length - 1 === currentIndexByGameID;
		const currentIndexIsFirst = 0 === currentIndexByGameID;

		console.log('swipe::direction::', direction);
		try {
			if (direction === 'top') {
				const nextGame = !currentIndexIsLast
					? $gamesData?.[currentIndexByGameID + 1]
					: $gamesData[0];

				if (nextGame?.id) {
					setTimeout(async () => {
						await goto(`/games/${nextGame?.id}/play`);
						await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
					}, 500);
				}
			} else if (direction === 'bottom') {
				const nextGame = !currentIndexIsFirst
					? $gamesData[currentIndexByGameID - 1]
					: $gamesData[$gamesData?.length - 1];

				if (nextGame?.id) {
					setTimeout(async () => {
						await goto(`/games/${nextGame?.id}/play`);
						await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
					}, 500);
				}
			}
		} catch (error) {
			console.log('error_handling_navigation_swipe::error::', error);
		}
		setTimeout(() => {
			disableTap = false;
		}, 300);
	}
	const progress = tweened(0, {
		duration: 200,
		easing: linear
	});
	const srcbuild = derived(
		[fileStoreFiles, editorOutContainerWidth, editorOutContainerHeight, gameControllerStore],
		([
			$fileStoreFiles,
			$editorOutContainerWidth,
			$editorOutContainerHeight,
			$gameControllerStore
		]) => {
			return buildDynamicSrcDoc(
				$fileStoreFiles,
				getRootFileId($fileStoreFiles),
				{
					width: $editorOutContainerWidth,
					height: $editorOutContainerHeight
				},
				$gameControllerStore
			);
		}
	);

	$: play = $playButton;
	$: {
		if (!$gamesData || $gamesData?.length < 1) {
			newGamesData = data?.userGames ?? data?.baseGames;
			gamesData.set(newGamesData);
		}
	}
	$: data,
		(() => {
			if (data) baseDataStore.set(data);
			fileStoreFiles.set($derivedFileSystemData);
		})();
	$: pan_time = Date.now() - last_pan_time;
	$: if (pan_time > 300) {
		pan_x = null;
		pan_y = null;
		countPanTime = false;
		pan_time = 0;
		hidden = false;
	}
	$: hidden === false,
		setTimeout(() => {
			countPanTime = false;
			hidden = true;
		}, 300);
	$: pan_y,
		tapCenter,
		(touchCoordinatesY = (() => {
			if (pan_y) {
				return navActionHeight / 2 - 225 - pan_y;
			} else if (tapCenter && !pan_y) {
				return tapCenter;
			}
		})());
	$: data,
		() => {
			if (data?.currentGame) {
				currentGame.set(data?.currentGame);
			}
			if (data?.topGame) {
				topGame.set(data?.topGame);
			}
			if (data?.bottomGame) {
				bottomGame.set(data?.bottomGame);
			}
		};
	$: data,
		(() => {
			if (data?.currentGame && data?.topGame && data?.bottomGame) {
				gamesAvailable = [data?.topGame, data?.currentGame, data?.bottomGame];
			} else if (data?.currentGame && data?.topGame) {
				gamesAvailable = [data?.topGame, data?.currentGame];
			} else if (data?.currentGame && data?.bottomGame) {
				gamesAvailable = [data?.currentGame, data?.bottomGame];
			} else if (data?.currentGame) {
				gamesAvailable = [data?.currentGame];
			}
		})();
	$: navActionCenter = navActionHeight / 2;
	$: if (pan_y !== panCoorY) {
		if (pan_y > panCoorY) {
			console.log('pan_y is increasing');
			panDirection = 'bottom';
		} else {
			console.log('pan_y is decreasing');
			panDirection = 'top';
		}
		// Update the previousCount after comparison
		panCoorY = pan_y;
	}
	$: panDistance = pan_y - navActionCenter;

	// $: panDirection,
	// 	(() => {
	// 		if (pan_y && navActionCenter) {
	// 			panDistance = pan_y - navActionCenter;
	// 		}
	// 	})();
	$: console.log('panDistance::', panDistance);
	$: progress.set(panDistance);
	$: src_build.set($srcbuild);

	onMount(() => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}
	});

	onDestroy(() => {
		fileStoreFiles.set(null);
		focusedFileId.set(null);
		fileSystemExpanderStore.set({});
		fileSystemMetaDataStore.set({
			gameId: null,
			userId: null
		});
		previouslyFocusedFileId.set(null);
		softSelectedFileId.set(null);
		openFiles.set([]);
		fileSystemSidebarWidth.set(200);
		fileSystemSidebarOpen.set(true);
		codePanes2.set([]);
		topGame.set(null);
		bottomGame.set(null);
		currentGame.set(null);
	});
</script>

<div
	class="main"
	class:isNotMobile={$appClientWidth && $appClientWidth > 498}
	style="--pan-distance: {$progress ??
		0}px;--touch-coordinates-x: {pan_x}px; --touch-coordinates-y: {direction === 'top'
		? ''
		: '-'}{touchCoordinatesY}px; --swipe-arrow: src('{SwipeArrow}'); --mid-point: {navActionHeight /
		2}px;"
>
	<div
		class="output-play-action-overlay"
		use:pan={{ delay: 300 }}
		on:pan={handlePan}
		on:swipe={handler}
		use:swipe={{ timeframe: 300, minSwipeDistance: 20 }}
	>
		{#if gamesAvailable}
			{#if play}
				<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} />
			{:else}
				{#each gamesAvailable as game, i (game?.id)}
					<div
						class="output-paused-overlay"
						class:isTop={i === 0}
						class:isCurrent={i === 1}
						class:isBottom={i === 2}
					>
						<div class="overlay-blur" />
						<div class="overlay-light-fade" />
						<div class="nav-action" bind:clientHeight={navActionHeight}>
							<div class="action-rift">
								<div class="rift-clip" />
							</div>
						</div>
						<div class="info-container">
							<h1>{game?.title}</h1>
							<p>{game?.description}</p>
						</div>
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</div>

<style>
	.output-play-action-overlay {
		width: 100%;
		height: 100%;
	}
	.main {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
	}
	.main.isNotMobile {
		margin-top: 0;
		margin-bottom: 0;
		height: calc(100% - 10px);
	}
	.nav-action {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8px;
		top: 0px;
		overflow: hidden;
		z-index: 100;
	}
	.action-rift {
		position: absolute;
		height: 100%;
		width: 5px;
		top: 0;
		left: calc(50% - 2.5px);
		z-index: 10;
	}
	.output-paused-overlay {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
	}
	.overlay-blur {
		position: absolute;
		width: 100%;
		height: 100%;
		background-image: url(https://picsum.photos/600/600);
		border-radius: 8px;
		filter: saturate(180%) blur(20px);
		top: 0;
	}
	.overlay-light-fade {
		background-color: rgba(255, 255, 255, 0.1);
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}
	.info-container {
		position: absolute;
		width: 72%;
		height: 100%;
		top: -55px;
		display: flex;
		flex-direction: column;
		left: 10vw;
		justify-content: center;
		align-items: flex-start;
		padding: 0 20px;
		color: #fff;
	}
	.info-container h1 {
		font-family: 'Inter';
		font-size: 2.75rem;
		margin-block-end: 0;
		text-shadow: 1px 2px 20px #0000003b;
	}
	.info-container p {
		font-family: 'Montserrat';
		font-size: 1rem;
		font-weight: 300;
		margin-block-start: 0;
		text-shadow: 1px 2px 20px #0000003b;
	}
	.isTop {
		transform: translateY(calc(-100% - 10px + var(--pan-distance)));
		opacity: 1;
	}
	.isCurrent {
		transform: translateY(calc(-100% + var(--pan-distance)));
		opacity: 1;
	}
	.isBottom {
		transform: translateY(calc(-100% + 10px + var(--pan-distance)));
		opacity: 1;
	}
</style>
