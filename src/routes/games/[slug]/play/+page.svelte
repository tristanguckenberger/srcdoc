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
	import { swipe } from 'svelte-gestures';

	function handleSwipe(direction) {
		console.log(`Swiped ${direction}`);
		console.log('swipedData::', data);
		// Handle swipe direction here
	}

	// Expiremental
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';

	export let data;
	const play = true;

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

	$: console.log('SRCBUILD::', $srcbuild);

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

	$: console.log('data::', data);

	async function handler(event) {
		direction = event.detail.direction;
		// console.log('SWIPE::DIRECTION::', direction);
		// console.log('swipedData::', Math.abs(data?.id));
		// Sort through all available games,
		// find the index of the current game (data?.id)
		console.log('data::', data);
		console.log('gamesData::', $gamesData);
		const currentIndexByGameID = $gamesData?.findIndex(
			(game) => game?.id?.toString() === data?.id?.toString()
		);
		// check to ensure the index isnt the last in the array
		const currentIndexIsLast = $gamesData?.length - 1 === currentIndexByGameID;
		// check to ensure the index isnt the last in the array
		const currentIndexIsFirst = 0 === currentIndexByGameID;
		try {
			console.log('gamesData::', $gamesData);
			console.log('currentIndexIsLast::', currentIndexIsLast);
			console.log('currentIndexIsFirst::', currentIndexIsFirst);
			if (direction === 'top') {
				// and then get the id of the games index + 1
				const nextGame = !currentIndexIsLast
					? $gamesData?.[currentIndexByGameID + 1]
					: $gamesData[0];
				console.log('nextGame::', nextGame);

				if (nextGame?.id) {
					await goto(`/games/${nextGame?.id}/play`);
					await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
				} else {
					console.log('nextGame::', nextGame);
					console.log('nextGame::id::', nextGame?.id);
				}
			} else if (direction === 'bottom') {
				const nextGame = !currentIndexIsFirst
					? $gamesData[currentIndexByGameID - 1]
					: $gamesData[$gamesData?.length - 1];

				// if (browser)
				// 	await goto(`/games/${nextGame?.id}/play`, {
				// 		invalidateAll: true
				// 	});
				// console.log('didNavigate::', didNavigate);
				if (nextGame?.id) {
					await goto(`/games/${nextGame?.id}/play`);
					await invalidate((url) => url.pathname === `/games/${nextGame?.id}/play`);
				} else {
					console.log('nextGame::', nextGame);
					console.log('nextGame::id::', nextGame?.id);
				}
				// setTimeout(async () => await goto(`/games/${nextGame?.id}/play`), 50);
				// window.location = `/games/${nextGame?.id}/play`;
			}
		} catch (error) {
			console.log('error_handling_navigation_swipe::error::', error);
		}
	}
</script>

<div class="main">
	<div class="output-play-action-overlay">
		<Output slot="pane-content" srcdocBuilt={$srcbuild ?? srcdocBuild} {play} />
		<div class="nav-action" use:swipe={{ timeframe: 300, minSwipeDistance: 20 }} on:swipe={handler}>
			<div class="action-rift" />
		</div>
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
		/* overflow-y: hidden; */
	}
	.nav-action {
		position: absolute;
		z-index: 100000;
		width: 100px;
		height: 40%;
		border: 3px solid red;
		top: 66.5px;
		right: 10px;
		overflow: hidden;
	}
	.action-rift {
		position: absolute;
		height: 100%;
		width: 5px;
		background-color: white;
		top: 0;
		left: calc(50% - 2.5px);
		z-index: 10;
	}
	/* rift-clip */
	.rift-clip {
		width: 50px;
		height: 50px;
		z-index: 11;
	}
</style>
