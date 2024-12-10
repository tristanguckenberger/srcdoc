<!-- @migration-task Error while migrating Svelte code: can't migrate `let play;` to `$derived` because there's a variable named derived.
     Rename the variable and try again or migrate by hand. -->
<script>
	// @ts-nocheck
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
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
		sideBarState,
		clientWidth
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
		derivedFileSystemData,
		focusedFolderId
	} from '$lib/stores/filesStore.js';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import Slider from '$lib/ui/Slider/index.svelte';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import { screenHeight, selectedOption, drawerOpen } from '$lib/stores/drawerStore';
	import Widget from '$lib/ui/Widget/index.svelte';
	import Comments from '$lib/ui/Widget/Components/Comments.svelte';
	import Issues from '$lib/ui/Widget/Components/Issues.svelte';
	import Reviews from '$lib/ui/Widget/Components/Reviews.svelte';
	import Leaderboards from '$lib/ui/Widget/Components/Leaderboards.svelte';
	import EditDetails from '$lib/ui/Widget/Components/EditDetails.svelte';
	import { afterNavigate, beforeNavigate, goto, invalidateAll } from '$app/navigation';
	import { gameSession, gameSessionState } from '$lib/stores/gameSession/index.js';
	import EditPlaylistDetails from '$lib/ui/Modal/components/EditPlaylistDetails.svelte';
	import AddToPlaylist from '$lib/ui/Modal/components/AddToPlaylist.svelte';
	import { gamePageInfoStore, modalFullInfoStore } from '$lib/stores/InfoStore.js';

	export let data;

	let play;
	let navActionHeight;
	let gamesAvailable = [];
	let allGamesData = [];
	let reactiveData = {};
	let ComponentOptions = [];
	let favoriteData = {};

	const srcbuild = derived(
		[
			fileStoreFiles,
			editorOutContainerWidth,
			editorOutContainerHeight,
			gameControllerStore,
			gameSession
		],
		([
			$fileStoreFiles,
			$editorOutContainerWidth,
			$editorOutContainerHeight,
			$gameControllerStore,
			$gameSession
		]) => {
			if (!$gameSession?.currentGame) return '';
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

	onMount(async () => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}
		allGamesData = data?.allGames ?? [];
	});

	function centerTarget(arr, target) {
		const targetIndex = arr.findIndex((item) => item.id === target);

		if (targetIndex === -1) {
			throw new Error('Target not found in the array');
		}

		const result = [];
		const len = arr.length;

		// Add elements before the target
		for (let i = 0; i < 2; i++) {
			result.push(arr[(targetIndex - 2 + i + len) % len]);
		}

		// Add the target element
		result.push(arr[targetIndex]);

		// Add elements after the target
		for (let i = 1; i <= 2; i++) {
			result.push(arr[(targetIndex + i) % len]);
		}

		return result;
	}

	onDestroy(() => {
		fileStoreFiles.set(null);
		focusedFileId.set(null);
		focusedFolderId.set(null);
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

	$: play = $playButton;
	$: data,
		(() => {
			if (data?.currentGame) baseDataStore.set(data?.currentGame);
			fileStoreFiles.set($derivedFileSystemData);
		})();
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
	$: src_build.set($srcbuild);
	$: (() => {
		return (ComponentOptions = [
			{
				name: 'Comments',
				props: {
					gameId: data?.id,
					comments: data?.comments,
					parentCommentId: null
				},
				component: Comments
			},
			{
				name: 'Issues',
				component: Issues
			},
			{
				name: 'Reviews',
				component: Reviews
			},
			{
				name: 'EditDetails',
				props: {
					gameId: data?.id,
					title: data?.title,
					description: data?.description,
					thumbnail: data?.thumbnail,
					published: Boolean(data?.published)
				},
				component: EditDetails
			},
			{
				name: 'Leaderboards',
				props: {
					gameId: data?.id
				},
				component: Leaderboards
			},
			{
				name: 'NewPlaylist',
				props: {
					name: '',
					description: '',
					isPublic: true
				},
				component: EditPlaylistDetails
			},
			{
				name: 'AddToPlaylist',
				props: {
					gameId: data?.id
				},
				component: AddToPlaylist
			}
		]);
	})();
	$: favorites = data?.currentGame?.favorites;
	$: gamesAvailableIds = gamesAvailable.map((game) => game.id);
</script>

<div
	class="main playPage"
	class:isNotMobile={$appClientWidth && $appClientWidth > 498}
	bind:clientHeight={$screenHeight}
>
	<div class="output-play-action-overlay">
		{#if gamesAvailable}
			{#if play}
				<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} relaxed />
			{:else}
				<Slider
					rawGamesData={allGamesData}
					{gamesAvailable}
					currentGameExport={data?.currentGame}
					bind:favorites
					bind:navActionHeight
				/>
			{/if}
		{/if}
	</div>
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget id={'inPage'} content={reactiveData} options={ComponentOptions} />
		</div>
	</Drawer>
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
	.drawer-component {
		/* overflow-y: scroll; */
		height: 100%;
	}
	:global(#editor-layout.playInRoute.isMobile) {
		margin-top: 0;
		margin-bottom: 0;
		height: calc(100%);
		padding-top: 10px;
	}
	@media (max-width: 498px) {
		:global(#editor-layout.playInRoute.isMobile) {
			margin-top: 0;
			margin-bottom: 0;
			height: calc(100%);
			padding-top: 0px;
		}
	}
	/* .main.playPage.isPWA { */
	/* padding-bottom: 50px; */
	/* } */
</style>
