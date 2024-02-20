<script>
	// @ts-nocheck
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import { session } from '$lib/stores/sessionStore.js';
	import {
		gamesData,
		currentGame,
		topGame,
		bottomGame,
		src_build,
		playButton,
		progressState
	} from '$lib/stores/gamesStore.js';
	import { derived, get } from 'svelte/store';
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
	// Expiremental
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import Slider from '$lib/ui/Slider/index.svelte';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import { screenHeight, selectedOption, drawerOpen } from '$lib/stores/drawerStore';
	import Widget from '$lib/ui/Widget/index.svelte';
	import Comments from '$lib/ui/Widget/Components/Comments.svelte';
	import Issues from '$lib/ui/Widget/Components/Issues.svelte';
	import Reviews from '$lib/ui/Widget/Components/Reviews.svelte';
	import EditDetails from '$lib/ui/Widget/Components/EditDetails.svelte';
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import { gameSession } from '$lib/stores/gameSession/index.js';

	export let data;
	// export let thumbnail;

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
				$gameControllerStore,
				$gameSession,
				gameSession
			);
		}
	);

	afterUpdate(() => {
		if (data?.user?.id) {
			session.set(data?.user);
		}
	});

	onMount(async () => {
		firstRun.set(true);

		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}
	});

	beforeNavigate((nav) => {
		// Trigger end game session activity
		if (gameSessionId) {
			const endGameSession = fetch(
				`/api/games/sessions/${gameSessionId}/activities/createNewGameSessionActivity`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					mode: 'cors',
					body: JSON.stringify({
						action: 'Stop'
					})
				}
			);

			endGameSession.then((res) => {
				console.log('endGameSession::', res);
			});
		}
	});

	afterNavigate(async () => {
		// rerun all load functions
		invalidateAll();

		// Trigger start game session activity
		const startGameSession = fetch(`/api/games/sessions/createGameSession/${await data?.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors'
		});

		let startGameSessionData = await startGameSession;
		const jsonBody = await startGameSessionData.json();

		if (jsonBody?.game_session_id) {
			gameSessionId = jsonBody?.game_session_id;
			gameSession.setInitialState({ currentGame: jsonBody?.game_id });

			if (gameSession) {
				const addStartActivity = fetch(
					`/api/games/sessions/${gameSessionId}/activities/createNewGameSessionActivity`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						mode: 'cors',
						body: JSON.stringify({
							action: 'Start'
						})
					}
				);

				const addStartActivityJSON = await addStartActivity;
				const addStartActivityData = await addStartActivityJSON.json();

				if (addStartActivityData?.game_user_activity_id) {
					console.log('addStartActivityData::', addStartActivityData);
				}
			}
		}
	});

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

	const getThumbnail = async (srcdoc) => {
		let thumbnail;
		htmlToImage?.toPng(srcdoc).then(function (dataUrl) {
			thumbnail = dataUrl;
		});

		return thumbnail;
	};

	let newGamesData = [];
	let gameSessionId;

	// Reactive function to set gameSession
	$: {
		if (data?.id) {
			gameSession.setInitialState({ currentGame: data?.currentGame });
		}
	}

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
					published: Boolean(data?.published)
				},
				component: EditDetails
			}
		]);
	})();
	$: data?.comments, (reactiveData = data ?? {});
	$: data?.favorites, (favoriteData = data?.favorites ?? {});
	$: allGamesData = data?.allGames ?? [];
</script>

<div
	class="main playPage"
	class:isNotMobile={$appClientWidth && $appClientWidth > 498}
	bind:clientHeight={$screenHeight}
>
	<div class="output-play-action-overlay">
		{#if gamesAvailable}
			{#if play}
				<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} />
			{:else}
				<Slider
					rawGamesData={allGamesData}
					{gamesAvailable}
					bind:favoritesObj={favoriteData}
					bind:navActionHeight
				/>
			{/if}
		{/if}
	</div>
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget content={reactiveData} options={ComponentOptions} />
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
