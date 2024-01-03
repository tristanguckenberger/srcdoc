<script>
	// @ts-nocheck
	import { afterNavigate, beforeNavigate, invalidate, invalidateAll } from '$app/navigation';
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
		playButton,
		progressState,
		resetProgress,
		progress,
		progressResetCheck
	} from '$lib/stores/gamesStore.js';
	import { derived, writable } from 'svelte/store';
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
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { swipe, pan, tap } from 'svelte-gestures';

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
	let pan_y = 0;
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
	let panStart = null;
	let panEnd = null;
	let panning = false;
	let distanceTop;
	let distanceBottom;
	let absDistance = 0;
	let handlingPanUp = false;
	let topIsNext = false; // css class for carousel
	let bottomIsNext = false; // css class for carousel
	let topElement;
	let currentElement;
	let bottomElement;
	let newPan = false;
	let isPanning = false;
	let initialId = data?.id;

	async function handlePanUp(event) {
		isPanning = false;
		handlingPanUp = true;
		newPan = false;

		if (panStart > panEnd) {
			// panDirection = 'top';
			absDistance = panStart - panEnd;
		} else if (panStart < panEnd) {
			// panDirection = 'bottom';
			absDistance = panEnd - panStart;
		}

		const currentIndexByGameID = $gamesData?.findIndex(
			(game) => game?.id?.toString() === data?.id?.toString()
		);
		const currentIndexIsLast = $gamesData?.length - 1 === currentIndexByGameID;
		const currentIndexIsFirst = 0 === currentIndexByGameID;

		if (panDirection === 'bottom' && absDistance > 0) {
			if (navActionHeight - absDistance < navActionCenter) {
				progress.set(navActionHeight + 10);

				let nextGame = gamesAvailable[0];
				if (nextGame?.id) {
					setTimeout(async () => {
						await goto(`/games/${nextGame?.id}/play`);
						await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`, {
							replaceState: false
						});
						await invalidateAll();
						progress.set(0, { duration: 0 });
					}, 500);
				}
			} else {
				absDistance = 0;
				progress.set(0);
				progressState.set(0);
			}
		}
		if (panDirection === 'top') {
			console.log('in::top::panDirection::', panDirection);
			if (absDistance >= navActionCenter) {
				console.log('in::top::absDistance::', absDistance);
				progress.set(0 - navActionHeight);

				let nextGame = gamesAvailable[2];
				if (nextGame?.id) {
					setTimeout(async () => {
						await goto(`/games/${nextGame?.id}/play`);
						await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`, {
							replaceState: false
						});
						await invalidateAll();
						progress.set(0, { duration: 0 });
					}, 500);
				}
			} else {
				console.log('hit::top::else::', absDistance);
				absDistance = 0;
				progressState.set(0);
				progress.set(0);
			}
		}
		handlingPanUp = false;
	}
	function handlePanDown(event) {
		panStart = null;
		panEnd = null;
		absDistance = 0;
		newPan = true;
		isPanning = true;
	}
	function handlePan(event) {
		disableTap = true;
		hidden = false;
		countPanTime = true;
		pan_x = event.detail.x;
		pan_y = event.detail.y;
		last_pan_time = Date.now();
	}
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
	$: $currentGame,
		$topGame,
		$bottomGame,
		data,
		(() => {
			if (
				($currentGame ?? data?.currentGame) &&
				($topGame ?? data?.topGame) &&
				($bottomGame ?? data?.bottomGame)
			) {
				gamesAvailable = [
					$topGame ?? data?.topGame,
					$currentGame ?? data?.currentGame,
					$bottomGame ?? data?.bottomGame
				];
			} else if (($currentGame ?? data?.currentGame) && ($topGame ?? data?.topGame)) {
				gamesAvailable = [$topGame ?? data?.topGame, $currentGame ?? data?.currentGame];
			} else if (($currentGame ?? data?.currentGame) && ($bottomGame ?? data?.bottomGame)) {
				gamesAvailable = [$currentGame ?? data?.currentGame, $bottomGame ?? data?.bottomGame];
			} else if ($currentGame ?? data?.currentGame) {
				gamesAvailable = [$currentGame ?? data?.currentGame];
			}
		})();
	$: navActionCenter = navActionHeight / 2;
	$: pan_y,
		(() => {
			if (pan_y !== panCoorY) {
				if (pan_y > panCoorY) {
					panDirection = 'bottom';
				} else if (pan_y < panCoorY) {
					panDirection = 'top';
				}

				panCoorY = pan_y;

				if (panStart === null) {
					panStart = pan_y;
				} else if (panStart !== null && panEnd === null && panning === false) {
					panEnd = pan_y;
				}
			}
		})();
	$: panEnd = pan_y;
	$: pan_y,
		(() => {
			if (!handlingPanUp || !$resetProgress) {
				absDistance = panEnd - panStart;
				progress.set(absDistance);
			}
		})();
	$: src_build.set($srcbuild);
	$: (() => {
		if (!newPan && $progress !== 0 && !handlingPanUp && !$resetProgress) {
			if (Math.abs($progress) > navActionCenter && panDirection === 'top') {
				progress.set(0 - navActionHeight - 10, { duration: 200 });
			} else if (!Boolean(Math.abs($progress) > navActionCenter) && panDirection === 'top') {
				progress.set(0, { duration: 200 });
			}

			if (Math.abs($progress) > navActionCenter && panDirection === 'bottom') {
				progress.set(navActionHeight + 10, { duration: 200 });
			} else if (!Boolean(Math.abs($progress) > navActionCenter) && panDirection === 'bottom') {
				progress.set(0, { duration: 200 });
			}
		}
	})();
	$: gamesAvailable, progress.set(0, { duration: 0 });

	onMount(() => {
		if ($progress !== 0) {
			progress.set(0, { duration: 0 });
		}

		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		if (document) {
			topElement = document.querySelector('.game_option_0');
			currentElement = document.querySelector('.game_option_1');
			bottomElement = document.querySelector('.game_option_2');
		}
		resetProgress.set(false);
	});

	$: $resetProgress,
		(() => {
			if ($resetProgress) {
				progressState.set(0);
				distanceMoved = 0;
				progress.set(0, { duration: 0 });
				absDistance = 0;
			} else {
				progressState.set($progress);
			}
		})();

	afterUpdate(() => {});

	$: $resetProgress,
		(() => {
			if ($resetProgress) {
				handlingPanUp = true;
				progressResetCheck.set(true);
				setTimeout(() => {
					progress.set(0, { duration: 0 });
					absDistance = 0;
					initialId = data?.id;
					setTimeout(() => {
						handlingPanUp = false;
						resetProgress.set(false);
					}, 300);
				}, 300);
			}
		})();

	beforeNavigate(async () => {});

	afterNavigate(async () => {
		panDirection = null;
		panStart = null;
		panEnd = null;
		absDistance = 0;

		progressResetCheck.set(true);
		$resetProgress = true;
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
		progress.set(0, { duration: 0 });
		resetProgress.set(false);
	});

	// distanceMoved is the distance the pan has moved
	// setting it this way allows us to reset the distanceMoved to 0
	// and then reset the carousel to the original position, without
	// having to worry about the carousel jumping around
	$: distanceMoved = $progressState;
</script>

<div
	class="main"
	class:isNotMobile={$appClientWidth && $appClientWidth > 498}
	style="--pan-distance: {distanceMoved}px; --mid-point: {navActionHeight /
		2}px; --page-height: {navActionHeight}px; --after-nav-distance: {distanceMoved}px;"
>
	<div
		class="output-play-action-overlay"
		use:pan={{ delay: 0 }}
		on:pan={handlePan}
		on:panup={handlePanUp}
		on:pandown={handlePanDown}
	>
		{#if gamesAvailable}
			{#if play}
				<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} />
			{:else}
				{#each gamesAvailable as game, i (`${game?.id}_index_${i}`)}
					<div
						class="output-paused-overlay game_option_{i}"
						class:isTop={i === 0}
						class:isCurrent={i === 1}
						class:isBottom={i === 2}
						class:topIsNext
						class:bottomIsNext
						class:resetProgress={$resetProgress}
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
		transform: translateY(calc((-10px - var(--page-height)) + var(--pan-distance)));
		opacity: 1;
		/* transition: transform 0.2s ease-in-out; */
	}
	.isTop.bottomIsNext {
		transform: translateY(calc(106% - 10px + var(--pan-distance)));
		opacity: 1;
		transition: none;
	}
	.isCurrent {
		transform: translateY(calc((0px - var(--page-height)) + var(--pan-distance)));
		opacity: 1;
		/* transition: transform 0.2s ease-in-out; */
	}
	.isCurrent.topIsNext {
		transform: translateY(calc(100% + var(--pan-distance)));
		opacity: 1;
	}
	.isCurrent.bottomIsNext {
		transform: translateY(calc(-206% - var(--pan-distance)));
		opacity: 1;
	}
	.isBottom {
		transform: translateY(calc(-100% + 10px + var(--pan-distance)));
	}
	.isBottom.topIsNext {
		transform: translateY(calc(-100% + 10px + var(--pan-distance)));
		opacity: 1;
		transition: none;
	}

	.isNext {
		transform: translateY(calc(0% + var(--pan-distance)));
		opacity: 1;
	}

	.isBottom.isNext {
		transform: translateY(calc(-200% + var(--pan-distance)));
		opacity: 1;
	}
	.resetProgress {
		transition: none !important;
	}
	/* --after-nav-distance */
	.isCurrent.resetProgress {
		transform: translateY(calc((0px - var(--page-height)) + 0px));
	}
	.isTop.resetProgress {
		transform: translateY(calc((-10px - var(--page-height)) + 0px));
	}
	.isBottom.resetProgress {
		transform: translateY(calc(-100% + 10px + 0px));
	}
</style>
