<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import { goto } from '$app/navigation';
	import { gamesData, currentGame, src_build } from '$lib/stores/gamesStore.js';
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

	function handleSwipe(direction) {
		console.log(`Swiped ${direction}`);
		console.log('swipedData::', data);
		// Handle swipe direction here
	}

	// Expiremental
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';

	export let data;
	let play = false;

	$: {
		if (!$gamesData || $gamesData?.length < 1) {
			newGamesData = data?.userGames ?? data?.baseGames;
			gamesData.set(newGamesData);
		}
	}

	$: data,
		(() => {
			// console.log('data::game::', data);
			// this will be our data's starting point
			// We will need to update this data on every keystroke
			if (data) baseDataStore.set(data);
			fileStoreFiles.set($derivedFileSystemData);
		})();
	$: srcdocBuild = (async () =>
		buildDynamicSrcDoc(
			$fileStoreFiles,
			getRootFileId($fileStoreFiles),
			{
				width: $editorOutContainerWidth,
				height: $editorOutContainerHeight
			},
			$gameControllerStore
		))();

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

	// $: console.log('SRCBUILD::', $srcbuild);

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
	});

	let direction;
	let tapRipple = false;
	let countPanTime = false;
	let pan_x;
	let pan_y;
	let last_pan_time;
	let pan_time;
	let tap_x;
	let tap_y;
	let clip_offset_height;
	let clip_offset_width;
	let hidden = true;
	let navActionHeight;
	let tapCenter;
	let touchCoordinatesY;
	let disablePan = false;
	let disableTap = false;

	// function handleTouchStart(event) {
	// 	touchStartX = event.touches[0].clientX;
	// 	touchStartY = event.touches[0].clientY;
	// }

	// function handleTouchMove(event) {
	// 	touchEndX = event.touches[0].clientX;
	// 	touchEndY = event.touches[0].clientY;
	// }

	// function handleTouchEnd(event) {
	// 	// Handle the end of the swipe gesture
	// }
	function handlePan(event) {
		disableTap = true;
		hidden = false;
		countPanTime = true;
		pan_x = event.detail.x;
		pan_y = event.detail.y;
		last_pan_time = Date.now();
		setTimeout(() => {
			disableTap = false;
		}, 300);
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

		try {
			if (direction === 'top') {
				const nextGame = !currentIndexIsLast
					? $gamesData?.[currentIndexByGameID + 1]
					: $gamesData[0];

				if (nextGame?.id) {
					await goto(`/games/${nextGame?.id}/play`);
					await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
				}
			} else if (direction === 'bottom') {
				const nextGame = !currentIndexIsFirst
					? $gamesData[currentIndexByGameID - 1]
					: $gamesData[$gamesData?.length - 1];

				if (nextGame?.id) {
					await goto(`/games/${nextGame?.id}/play`);
					await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
				}
			}
		} catch (error) {
			console.log('error_handling_navigation_swipe::error::', error);
		}
		setTimeout(() => {
			disableTap = false;
		}, 300);
	}

	$: pan_y,
		tapCenter,
		(touchCoordinatesY = (() => {
			if (pan_y) {
				return navActionHeight / 2 - 225 - pan_y;
			} else if (tapCenter && !pan_y) {
				return tapCenter;
			}
		})());

	$: srcdocBuilt = (async () => {
		if (play) {
			return $srcbuild;
		} else {
			return null;
		}
	})();
</script>

<div
	class="main"
	style="--touch-coordinates-x: {pan_x}px; --touch-coordinates-y: {touchCoordinatesY}px; --swipe-arrow: src('{SwipeArrow}'); --mid-point: {navActionHeight /
		2}px;"
>
	<div class="output-play-action-overlay">
		{#if play}
			<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} />
		{:else}
			<button
				class="play-button"
				class:play-button-hidden={play}
				on:click={() => {
					play = true;
				}}>Play</button
			>
			<div
				class="nav-action"
				use:swipe={{ timeframe: 300, minSwipeDistance: 20 }}
				on:swipe={handler}
				use:pan={{ delay: 300 }}
				on:pan={handlePan}
				use:tap={{ timeframe: 300 }}
				on:tap={handleTap}
				bind:clientHeight={navActionHeight}
			>
				<div class="action-rift">
					<img class="action-icon" src={SwipeArrow} alt="Swipe Action Icon" />
					<div
						class="rift-clip"
						class:tapRipple
						bind:offsetHeight={clip_offset_height}
						bind:offsetWidth={clip_offset_width}
						class:hidden
					/>
				</div>
			</div>
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
	.nav-action {
		position: absolute;
		z-index: 100000;
		width: 100px;
		height: 30%;
		border-radius: 6px;
		top: 66.5px;
		right: 10px;
		overflow: hidden;
	}
	.action-rift {
		position: absolute;
		height: 100%;
		width: 5px;
		top: 0;
		left: calc(50% - 2.5px);
		z-index: 10;
	}
	.rift-clip {
		width: 100px;
		height: 100px;
		z-index: 11;
		position: absolute;
		background: rgba(255, 255, 255, 0.227);
		border-radius: 6px;
		/* background: radial-gradient(circle, hsla(0, 0%, 100%, 1) 25%, hsla(0, 0%, 100%, 0) 50%);
		background: -moz-radial-gradient(circle, hsla(0, 0%, 100%, 1) 25%, hsla(0, 0%, 100%, 0) 50%);
		background: -webkit-radial-gradient(circle, hsla(0, 0%, 100%, 1) 25%, hsla(0, 0%, 100%, 0) 50%); */
		/* background: hsla(0, 0%, 100%, 1);
		background: linear-gradient(
			135deg,
			hsla(0, 0%, 100%, 1) 1%,
			hsla(0, 0%, 100%, 1) 50%,
			hsla(0, 0%, 100%, 1) 100%
		);
		background: -moz-linear-gradient(
			135deg,
			hsla(0, 0%, 100%, 1) 1%,
			hsla(0, 0%, 100%, 1) 50%,
			hsla(0, 0%, 100%, 1) 100%
		);
		background: -webkit-linear-gradient(
			135deg,
			hsla(0, 0%, 100%, 0) 1%,
			hsla(0, 0%, 100%, 1) 50%,
			hsla(0, 0%, 100%, 0) 100%
		); */
		overflow: hidden;
		left: calc(50% - (50px));
		top: var(--touch-coordinates-y);
		display: block;
		opacity: 1;
		transition: opacity 0.3s linear;
		/* clip-path: ellipse(25% 6% at 50% 50%); */
	}
	.rift-clip.hidden {
		opacity: 0;
	}
	/* create ripple animation */
	@keyframes ripple {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		50% {
			transform: scale(2);
			opacity: 0.5;
		}
		100% {
			transform: scale(4);
			opacity: 0;
		}
	}

	.rift-clip.tapRipple {
		/* opacity: 1; */
		animation: ripple 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	/* .rift-clip.tapRipple {
		opacity: 0;
	} */
	.action-icon {
		position: absolute;
		top: calc(50% - 30px);
		left: calc(50% - 36.34px / 2);
		height: 50%;
		filter: invert(1) brightness(0.5);
	}
	.play-button {
		position: absolute;
		z-index: 100000;
		width: 100px;
		height: 30%;
		border-radius: 6px;
		top: (50% - 15%);
		left: calc(50% - 100px);
	}
	.play-button.hidden {
		display: none;
	}
</style>
