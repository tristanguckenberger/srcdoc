<script>
	// @ts-nocheck
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { debounce } from 'lodash-es';

	// SVELTE IMPORTS
	import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
	import { page, navigating } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	// CUSTOM STORE IMPORTS
	import { playButton, actionMenuOpen, gameFavorites } from '$lib/stores/gamesStore.js';
	import { hidePlayButtonStore } from '$lib/stores/gameControllerStore.js';
	import {
		fileSystemSidebarOpen,
		triggerCompile,
		filesToUpdate,
		focusedFileId,
		initialDataStore,
		firstRun,
		openFiles
	} from '$lib/stores/filesStore';
	import {
		sideBarState,
		sideBarWidth,
		modalOpenState,
		appClientWidth
	} from '$lib/stores/layoutStore.js';
	import { session } from '$lib/stores/sessionStore.js';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import { routeHistoryStore } from '$lib/stores/routeStore';
	import { drawerOpen, screenHeight, selectedOption } from '$lib/stores/drawerStore.js';
	import { emblaInstance, triggerNavigation } from '$lib/stores/sliderStore.js';
	import {
		gameSession,
		gameSessionScore,
		gameSessionState
	} from '$lib/stores/gameSession/index.js';
	import { autoStack, itemsInStack } from '$lib/stores/modalStackStore';

	// COMPONENT IMPORTS
	import Modal from '$lib/ui/Modal/index.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import LoadingIndicator from '$lib/ui/LoadingIndicator/index.svelte';
	import ModalStack from '$lib/ui/ModalStack/index.svelte';

	// ASSET IMPORTS
	import bgFadedMono16 from '$lib/assets/bgFadedMono16.svg';
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import { searchResultsStore } from '$lib/stores/search/searchStore';
	import SearchResults from '$lib/ui/NavWidgets/SearchResults.svelte';
	import { writable } from 'svelte/store';
	import { copyData } from '$lib/platformCopy/copyData.js';
	import {
		editorPageInfoStore,
		gamePageInfoStore,
		homePageInfoStore,
		modalFullInfoStore
	} from '$lib/stores/InfoStore.js';
	import NavigationBar from '$lib/ui/Navigation/index.svelte';
	import { addPaddingToEditorStore } from '$lib/stores/editorStore';

	// PROPS
	export let sessionData; // TODO, ensure this isn't being used and remove it
	export let data; // This is the data from the server, includes `sessionData`

	// Variables
	let preferedThemeMode;
	let dropDownToggle = false;
	let isFavorited = false;
	let deleteOrCreateFav = false;
	let creatingNewPlaylist = false;
	let mainPageElement;
	let mainElement;
	let shouldAddPadding = false;
	const showBoxShadow = writable(false);

	// FUNCTIONS
	const handleScrollBack = () => {
		$emblaInstance?.scrollNext();
		setTimeout(() => {
			triggerNavigation.set(true);
		}, 300);
	};

	const debouncedScrollBack = debounce(handleScrollBack, 350);

	const handleScrollForward = () => {
		$emblaInstance?.scrollPrev();
		setTimeout(() => {
			triggerNavigation.set(true);
		}, 300);
	};

	const debouncedScrollForward = debounce(handleScrollForward, 350);

	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });

		if (browser) {
			preferedThemeMode = window?.matchMedia('(prefers-color-scheme: light)');
			preferedThemeMode?.addEventListener('change', updateTheme);
			updateTheme(preferedThemeMode);
			if (sessionData && !$session) {
				session.set(sessionData);
			}

			// Start local storage stores
			homePageInfoStore.useLocalStorage();
			gamePageInfoStore.useLocalStorage();
			editorPageInfoStore.useLocalStorage();
		}

		// try this in an onMount and an afterUpdate
		mainPageElement = mainElement?.querySelector('.main');

		// if we have the main page element, we can add the event listeners for scrolling
		return () => {
			preferedThemeMode?.removeListener('change', updateTheme);
		};
	});

	beforeNavigate(async (nav) => {
		if (gameSessionId) {
			try {
				await addGameSessionActivity(gameSessionId, 'Stop');
				await fetch(`/api/games/sessions/updateGameSession/${gameSessionId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						sessionTotalScore: $gameSessionScore
					})
				}).then(async (res) => {
					$gameSessionScore = 0;
				});
			} catch (error) {
				console.log('error::', error);
			}
		}

		if (nav?.to?.route?.id === '/games/[slug]/play') {
			fileSystemSidebarOpen.set(true);
		}

		isFavorited = false;
		if (!isPlayPage && isMobile) {
			sideBarState.set(false);
		}
	});

	afterNavigate(async (nav) => {
		if (!isPlayPage && isMobile) {
			sideBarState.set(false);
		}

		if (!sessionData?.username && !$session?.username && sessionData?.token) {
			await invalidateAll();
		}

		if (creatingNewPlaylist) {
			$playButton = false;
			browser && selectedOption.set(0);
			$playButton = false;
			$drawerOpen = true;
			creatingNewPlaylist = false;
		}
	});

	afterUpdate(async () => {
		// await tick();
		if ($openFiles?.length > 0) {
			$addPaddingToEditorStore = true;
		} else {
			$addPaddingToEditorStore = false;
		}

		// await tick();
		shouldAddPadding = $addPaddingToEditorStore;

		$gameFavorites?.favorites?.some((fav) => {
			isFavorited = fav?.user_id === sessionData?.id ?? false;
		});

		deleteOrCreateFav = isFavorited ?? false;

		if (mainPageElement) {
			mainPageElement?.removeEventListener('scroll', handleScroll);
			mainPageElement.addEventListener('scroll', handleScroll);
		}

		return () => {
			mainPageElement?.removeEventListener('scroll', handleScroll);
		};
	});

	onDestroy(() => {
		preferedThemeMode?.removeListener(updateTheme);
	});

	const handleScroll = (e) => {
		if (e.target.scrollTop > 0) {
			$showBoxShadow = true;
		} else {
			$showBoxShadow = false;
		}
	};

	const loaderCheck = (navigation) => {
		let canLoad = false;

		// navigating to BUT NOT FROM AND TO the play page
		if (navigation) {
			// make sure this isnt just a refresh, if it is show the loader, if not, dont
			if (
				navigation?.to?.route?.id === '/games/[slug]/play' &&
				navigation?.from?.route?.id === '/games/[slug]/play'
			) {
				if (navigation?.to?.params?.slug !== navigation?.from?.params?.slug) {
					canLoad = false;
				} else {
					canLoad = true;
				}

				canLoad = false;
			} else {
				canLoad = true;
			}
		}

		return canLoad;
	};
	const updateTheme = (e) => {
		themeKeyStore.set(e.matches ? 'light' : 'dark');
	};

	const toggleDropDown = () => {
		dropDownToggle = !dropDownToggle;
	};

	const toggleSideBar = () => {
		if (playInRoute) {
			$sideBarState = !$sideBarState;
		} else {
			$sideBarState = !$sideBarState;
			$fileSystemSidebarOpen = false;
		}
	};

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

	const playToggle = async () => {
		const gameSessionId = $gameSessionState?.id;

		if ($drawerOpen) {
			// if the drawer component is open, we dont want to show the play button or allow it to be clicked
			$playButton = false;
		} else {
			// otherwise, we can show the play button and allow it to be clicked
			$playButton = !play;

			if (!$playButton) {
				const userScore = $gameSession?.userScore;
				gameSession.stop(userScore);

				if ($gameSessionState?.id) {
					await addGameSessionActivity($gameSessionState?.id, 'Pause');
				}
			} else {
				if ($gameSessionState?.id && !$firstRun) {
					await addGameSessionActivity($gameSessionState?.id, 'Resume');
				} else {
					$firstRun = false;
				}
			}
		}
	};

	// REACTIVE VARIABLES & STATEMENTS
	// $: $openFiles?.length > 0
	// 	? ($addPaddingToEditorStore = true)
	// 	: ($addPaddingToEditorStore = false);
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isVerifyPage = splitPath[splitPath?.length - 1] === 'verify';
	$: isHomePage = $page?.route?.id === '/';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
	$: sessionData = data?.sessionData ?? $session;
	$: modalIsOpen = $modalOpenState;
	$: isPlayPage = $page?.route?.id === '/games/[slug]/play';
	$: isMobile = $appClientWidth < 768;
	$: play = $playButton;
	$: isProfilePage =
		splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main');
	$: isBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' ||
		(splitPath[1] === 'users' && !isProfilePage && !splitPath.some((path) => path === 'users'));
	$: isUserGamesBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users';
	$: isUserLibraryPage = splitPath[splitPath?.length - 1] === 'library';
	$: isUserFavoritesBrowsePage =
		splitPath[splitPath?.length - 1] === 'favorites' && splitPath[1] === 'games';
	$: (() => {
		$gameFavorites?.favorites?.some((fav) => {
			isFavorited = fav?.user_id === sessionData?.id ?? false;
		});
	})();
	$: canShowLoader = (() => loaderCheck($navigating))();
	$: gameSessionId = $gameSessionState?.id;

	// CONSOLE LOGS
	$: {
		console.log('stack::$autoStack::', $autoStack);
		console.log('stack::$itemsInStack::', $itemsInStack);
		// console.log('fileSys::=======================');
		// console.log('fileSys::openFiles::', $openFiles);
		// console.log('fileSys::=======================');
		// console.log('fileSys::focusedFileId::', $focusedFileId);
		// console.log('fileSys::=======================');
		// console.log('fileSys::softSelectedFileId::', $softSelectedFileId);
		// console.log('fileSys::=======================');
		// console.log('$page::', $page);
		// console.log('showBoxShadow::', $showBoxShadow);
	}

	$: console.log('routeHistoryStore::previousRoute::', previousRoute);
	$: previousRoute = $routeHistoryStore[$routeHistoryStore.length - 2];
	$: disableBackButton = $routeHistoryStore?.length < 2;
	$: console.log('$routeHistoryStore::', $routeHistoryStore);
	$: myProjectsLink = !$session?.id ? null : `/users/${$session?.id}/games`;
	$: myLibraryLink = !$session?.id ? null : `/users/${$session?.id}/library`;
	$: newPlayListLink = !$session?.id ? null : `/users/${$session?.id}/library`;
	$: favoritesLink = !$session?.id ? null : '/games/favorites';
	/**
	 * We have to reference the store to trigger the reactive statement
	 */
	$routeHistoryStore;
</script>

<div
	class="layout-container"
	class:isBrowsePage
	style="--svg-bg: url('{bgFadedMono16}'); --screenHeight: {$screenHeight -
		15}px; height: 100%; width: 100%; {themeString}"
>
	<div
		class="bg-container"
		style={'height: 100%; width: 100%;'}
		class:isBrowsePage
		class:engineInRoute
		class:gameProfile={(isProfilePage || playInRoute) && !engineInRoute}
		bind:clientWidth={$appClientWidth}
	>
		<NavigationBar {data} {sessionData} />
		<!-- {#if modalIsOpen}
			<Modal />
		{/if} -->
		<div
			class="page-container"
			class:addPaddingToEditorStore={shouldAddPadding}
			class:engineInRoute
			class:isGameProfile={isProfilePage || playInRoute}
			class:showSideBar={!engineInRoute && $sideBarState}
			class:isProfilePage
			class:isBrowsePage
			class:isUserGamesBrowsePage
			class:isUserFavoritesBrowsePage
		>
			<div
				class="sidebar"
				class:engineInRoute
				class:showSideBar={$sideBarState}
				bind:clientWidth={$sideBarWidth}
			>
				<div id="primary-actions" class="sidebar-section">
					<ul>
						<a href="/games" class:active={!isUserGamesBrowsePage && isBrowsePage}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H52V117.28l76-71.75,76,71.75Z"
								/></svg
							>
							<span>Home</span>
						</a>
						<a href="/games/quick-play">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M128,44a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,44Zm0,168a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,212ZM164.49,99.51a12,12,0,0,1,0,17l-28,28a12,12,0,0,1-17-17l28-28A12,12,0,0,1,164.49,99.51ZM92,16A12,12,0,0,1,104,4h48a12,12,0,0,1,0,24H104A12,12,0,0,1,92,16Z"
								/></svg
							>
							<span>Quick Play</span>
						</a>
						<a
							href={favoritesLink}
							class:active={isUserFavoritesBrowsePage}
							class="sidebar-item"
							class:muted={!$session?.id}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M178,28c-20.09,0-37.92,7.93-50,21.56C115.92,35.93,98.09,28,78,28A66.08,66.08,0,0,0,12,94c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,224.14,244,166.34,244,94A66.08,66.08,0,0,0,178,28Zm-5.49,142.36A328.69,328.69,0,0,1,128,202.16a328.69,328.69,0,0,1-44.51-31.8C61.82,151.77,36,123.42,36,94A42,42,0,0,1,78,52c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,61.4,160.2,52,178,52a42,42,0,0,1,42,42C220,123.42,194.18,151.77,172.51,170.36Z"
								/></svg
							>
							<span>Favorites</span>
						</a>
						<a
							href={newPlayListLink}
							class="sidebar-item"
							class:muted={!$session?.id}
							on:click={() => {
								if (!$session?.id) {
									return;
								}
								creatingNewPlaylist = true;
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#ffffff"
								viewBox="0 0 256 256"
								><path
									d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
								/></svg
							>
							<span>New Playlist</span>
						</a>
						<a
							href={myLibraryLink}
							class="sidebar-item"
							class:active={isUserLibraryPage}
							class:muted={!$session?.id}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M96,104a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H104A8,8,0,0,1,96,104Zm8,40h64a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16Zm128,48a32,32,0,0,1-32,32H88a32,32,0,0,1-32-32V64a16,16,0,0,0-32,0c0,5.74,4.83,9.62,4.88,9.66h0A8,8,0,0,1,24,88a7.89,7.89,0,0,1-4.79-1.61h0C18.05,85.54,8,77.61,8,64A32,32,0,0,1,40,32H176a32,32,0,0,1,32,32V168h8a8,8,0,0,1,4.8,1.6C222,170.46,232,178.39,232,192ZM96.26,173.48A8.07,8.07,0,0,1,104,168h88V64a16,16,0,0,0-16-16H67.69A31.71,31.71,0,0,1,72,64V192a16,16,0,0,0,32,0c0-5.74-4.83-9.62-4.88-9.66A7.82,7.82,0,0,1,96.26,173.48ZM216,192a12.58,12.58,0,0,0-3.23-8h-94a26.92,26.92,0,0,1,1.21,8,31.82,31.82,0,0,1-4.29,16H200A16,16,0,0,0,216,192Z"
								/></svg
							>
							<span>My Library</span>
						</a>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<h3>Explore</h3>
					<ul>
						<a href="/games/trending" class:active={$page.route.id === '/games/trending'}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M244,56v64a12,12,0,0,1-24,0V85l-75.51,75.52a12,12,0,0,1-17,0L96,129,32.49,192.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0L136,135l67-67H168a12,12,0,0,1,0-24h64A12,12,0,0,1,244,56Z"
								/></svg
							>
							<span>Trending</span>
						</a>
						<a href="/games/top-rated" class:active={$page.route.id === '/games/top-rated'}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M199,125.31l-49.89-18.38L130.69,57a19.92,19.92,0,0,0-37.38,0L74.93,106.93,25,125.31a19.92,19.92,0,0,0,0,37.38l49.89,18.38L93.31,231a19.92,19.92,0,0,0,37.38,0l18.38-49.89L199,162.69a19.92,19.92,0,0,0,0-37.38Zm-60,33.9a19.89,19.89,0,0,0-11.8,11.8L112,212.28,96.79,171A19.89,19.89,0,0,0,85,159.21h0L43.72,144,85,128.79A19.89,19.89,0,0,0,96.79,117L112,75.72,127.21,117a19.89,19.89,0,0,0,11.8,11.8L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z"
								/></svg
							>
							<span>Top Rated</span>
						</a>
						<a href="/games/top-played" class:active={$page.route.id === '/games/top-played'}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M169.57,46.11a12,12,0,0,1,15.12-7.7L188,39.48V36a12,12,0,0,1,24,0v3.48l3.31-1.07a12,12,0,1,1,7.42,22.82l-3.31,1.08,2,2.82a12,12,0,1,1-19.41,14.1L200,76.42,198,79.23a12,12,0,1,1-19.41-14.1l2-2.82-3.31-1.08A12,12,0,0,1,169.57,46.11ZM236,128A108,108,0,1,1,128,20a109.19,109.19,0,0,1,18,1.49,12,12,0,0,1-4,23.67A85,85,0,0,0,128,44,83.94,83.94,0,0,0,62.05,179.94a83.48,83.48,0,0,1,29-23.42,52,52,0,1,1,74,0,83.48,83.48,0,0,1,29,23.42A83.57,83.57,0,0,0,212,128a85.2,85.2,0,0,0-1.16-14,12,12,0,0,1,23.67-4A109,109,0,0,1,236,128ZM128,148a28,28,0,1,0-28-28A28,28,0,0,0,128,148Zm0,64a83.53,83.53,0,0,0,48.43-15.43,60,60,0,0,0-96.86,0A83.53,83.53,0,0,0,128,212Z"
								/></svg
							>
							<span>Top Played</span>
						</a>
						<a href="/games/new" class:active={$page.route.id === '/games/new'}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M219.23,159.2a196.66,196.66,0,0,0-18-31.2,196.66,196.66,0,0,0,18-31.2c11.84-26.31,11.69-47.48-.43-59.6s-33.29-12.27-59.6-.43a196.66,196.66,0,0,0-31.2,18,196.66,196.66,0,0,0-31.2-18c-26.31-11.84-47.48-11.69-59.6.43s-12.27,33.29-.43,59.6a196.66,196.66,0,0,0,18,31.2,196.66,196.66,0,0,0-18,31.2c-11.84,26.31-11.69,47.48.43,59.6h0C43.33,224.93,51.78,228,62,228c10,0,21.77-2.92,34.76-8.77a196.66,196.66,0,0,0,31.2-18,196.66,196.66,0,0,0,31.2,18c13,5.85,24.74,8.77,34.76,8.77,10.26,0,18.71-3.07,24.84-9.2h0C230.92,206.68,231.07,185.51,219.23,159.2Zm-17.41-105c5.25,5.26,1.79,26-16,53.78-5.61-6.66-11.65-13.25-18.07-19.67S154.7,75.83,148,70.22C175.82,52.39,196.56,48.93,201.82,54.18ZM171.24,128a288.6,288.6,0,0,1-20.51,22.73A288.6,288.6,0,0,1,128,171.24a288.6,288.6,0,0,1-22.73-20.51A288.6,288.6,0,0,1,84.76,128,298.55,298.55,0,0,1,128,84.76a286.83,286.83,0,0,1,22.73,20.51A286.83,286.83,0,0,1,171.24,128ZM54.18,54.18c1.46-1.45,4.1-2.24,7.75-2.24,9.53,0,25.94,5.39,46,18.28-6.66,5.61-13.25,11.65-19.67,18.07S75.83,101.3,70.22,108C52.39,80.18,48.93,59.44,54.18,54.18Zm0,147.64c-5.25-5.26-1.79-26,16-53.78,5.61,6.66,11.65,13.25,18.07,19.67s13,12.46,19.67,18.07C80.18,203.61,59.44,207.07,54.18,201.82Zm147.64,0c-5.26,5.25-26,1.79-53.78-16,6.66-5.61,13.25-11.65,19.67-18.07s12.46-13,18.07-19.67C203.61,175.82,207.07,196.56,201.82,201.82ZM144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128Z"
								/></svg
							>
							<span>Recently Added</span>
						</a>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<h3>Projects</h3>
					<ul>
						<a
							href={myProjectsLink}
							class:active={isUserGamesBrowsePage}
							class="sidebar-item"
							class:muted={!$session?.id}
							aria-disabled={!$session?.id}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M176,116H152a12,12,0,0,1,0-24h24a12,12,0,0,1,0,24ZM104,92h-4V88a12,12,0,0,0-24,0v4H72a12,12,0,0,0,0,24h4v4a12,12,0,0,0,24,0v-4h4a12,12,0,0,0,0-24ZM244.76,202.94a40,40,0,0,1-61,5.35,7,7,0,0,1-.53-.56L144.67,164H111.33L72.81,207.73c-.17.19-.35.38-.53.56A40,40,0,0,1,4.62,173.05a1.18,1.18,0,0,1,0-.2L21,88.79A63.88,63.88,0,0,1,83.88,36H172a64.08,64.08,0,0,1,62.93,52.48,1.8,1.8,0,0,1,0,.19l16.36,84.17a1.77,1.77,0,0,1,0,.2A39.74,39.74,0,0,1,244.76,202.94ZM172,140a40,40,0,0,0,0-80H83.89A39.9,39.9,0,0,0,44.62,93.06a1.55,1.55,0,0,0,0,.21l-16.34,84a16,16,0,0,0,13,18.44,16.07,16.07,0,0,0,13.86-4.21L96.9,144.07a12,12,0,0,1,9-4.07Zm55.76,37.31-7-35.95a63.84,63.84,0,0,1-44.27,22.46l24.41,27.72a16,16,0,0,0,26.85-14.23Z"
								/></svg
							>
							<span>My Projects</span>
						</a>
						<div class="sidebar-action" class:muted={!$session?.id}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-84a12,12,0,0,1-12,12H140v28a12,12,0,0,1-24,0V140H88a12,12,0,0,1,0-24h28V88a12,12,0,0,1,24,0v28h28A12,12,0,0,1,180,128Z"
								/></svg
							>
							<form method="POST" action="/games/?/addProject" class="new-project-form" use:enhance>
								<Button label="New Project" />
							</form>
						</div>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<ul>
						{#if sessionData?.id && !sessionData?.is_active && !$session?.is_active}
							<a href="/users/{sessionData?.id}/verify" class:active={isVerifyPage}>
								Account Verfication
							</a>
						{/if}
						{#if !sessionData?.username && !$session?.username}
							<a href="/" class:active={isHomePage}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="#000000"
									viewBox="0 0 256 256"
									><path
										d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM200,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h64a8,8,0,0,0,8-8V40A8,8,0,0,0,200,32Z"
									/></svg
								>
								<span>Sign In or Register</span></a
							>
						{/if}
						{#if sessionData?.username || $session?.username}
							<ul class="profile-info" class:showSideBar={$sideBarState}>
								{#if sessionData?.username || $session?.username}
									<li>
										<Button
											link="/users/{sessionData?.id}"
											userName={sessionData?.username ?? $session?.username}
											userAvatar={sessionData?.profile_photo ?? $session?.profile_photo}
											isRounded
											action={toggleDropDown}
											showDropDown={dropDownToggle}
										/>
									</li>
								{/if}
							</ul>
							<li class="sidebar-action">
								<form
									class="logout-form"
									action="/?/logout"
									method="POST"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.status === 200) {
												session.set(null);
												invalidateAll();
											}
										};
									}}
								>
									<Button label="Logout" />
								</form>
							</li>
						{/if}
					</ul>
				</div>
			</div>
			<main
				class:isProfilePage={splitPath[1] === 'users' && splitPath?.length === 3}
				class:scrollable={!engineInRoute && !playInRoute && isBrowsePage}
				class:editor={(engineInRoute || playInRoute) && !isBrowsePage}
				class:showSideBar={$sideBarState}
				class:isPlayPage
				class:isMobile
				class:showLoading={canShowLoader}
				style={`${themeString}`}
				bind:this={mainElement}
			>
				<slot />
			</main>
			{#if isMobile && !$playButton && !engineInRoute}
				<li class="sidebar-toggle isMobile" class:showSideBar={$sideBarState} class:engineInRoute>
					<Button action={toggleSideBar} label={$sideBarState ? 'close' : 'open'} link={null} />
				</li>
			{/if}
		</div>

		{#if isPlayPage}
			{#if !$playButton && !$drawerOpen && !canShowLoader}
				<div class="divider">
					<div
						class="slider-action top-icon"
						role="button"
						tabindex="0"
						on:click={debouncedScrollBack}
						on:keypress={() => {
							// console.log('key pressed');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="#000000"
							viewBox="0 0 256 256"
							><path
								d="M216.49,168.49a12,12,0,0,1-17,0L128,97,56.49,168.49a12,12,0,0,1-17-17l80-80a12,12,0,0,1,17,0l80,80A12,12,0,0,1,216.49,168.49Z"
							/></svg
						>
					</div>
					<div
						class="slider-action bottom-icon"
						role="button"
						tabindex="0"
						on:click={debouncedScrollForward}
						on:keypress={() => {
							// console.log('key pressed');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="#000000"
							viewBox="0 0 256 256"
							><path
								d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"
							/></svg
						>
					</div>
				</div>
			{/if}
			<div
				class="play-button-container"
				class:fade={!$hidePlayButtonStore || (!$playButton && $actionMenuOpen)}
			>
				<button
					class="action-button play-button"
					class:drawerOpen={$drawerOpen}
					on:click={playToggle}
					class:fade={!$hidePlayButtonStore || (!$playButton && $actionMenuOpen)}
					class:showLoading={canShowLoader}
				>
					{#if !$playButton}
						<svg
							class="action-button-icon"
							width="37"
							height="44"
							viewBox="0 0 37 44"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M36.5 21.5692C36.5014 22.1325 36.3569 22.6866 36.0807 23.1776C35.8045 23.6685 35.406 24.0797 34.9239 24.371L5.04364 42.65C4.53987 42.9585 3.96288 43.1269 3.37226 43.1379C2.78165 43.1488 2.19882 43.0019 1.68398 42.7122C1.17403 42.4271 0.749237 42.0113 0.453271 41.5076C0.157306 41.0039 0.000852063 40.4304 0 39.8462V3.29226C0.000852063 2.70802 0.157306 2.13455 0.453271 1.63082C0.749237 1.1271 1.17403 0.711297 1.68398 0.426177C2.19882 0.136559 2.78165 -0.0103683 3.37226 0.000568957C3.96288 0.0115063 4.53987 0.179912 5.04364 0.488393L34.9239 18.7674C35.406 19.0587 35.8045 19.4699 36.0807 19.9608C36.3569 20.4518 36.5014 21.0059 36.5 21.5692Z"
								fill="white"
							/>
						</svg>
					{:else}
						<svg
							class="action-button-icon"
							width="25"
							height="27"
							viewBox="0 0 25 27"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M24.75 2.25V24.75C24.75 25.3467 24.5129 25.919 24.091 26.341C23.669 26.7629 23.0967 27 22.5 27H16.875C16.2783 27 15.706 26.7629 15.284 26.341C14.8621 25.919 14.625 25.3467 14.625 24.75V2.25C14.625 1.65326 14.8621 1.08097 15.284 0.65901C15.706 0.237053 16.2783 0 16.875 0H22.5C23.0967 0 23.669 0.237053 24.091 0.65901C24.5129 1.08097 24.75 1.65326 24.75 2.25ZM7.875 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V24.75C0 25.3467 0.237053 25.919 0.65901 26.341C1.08097 26.7629 1.65326 27 2.25 27H7.875C8.47174 27 9.04403 26.7629 9.46599 26.341C9.88795 25.919 10.125 25.3467 10.125 24.75V2.25C10.125 1.65326 9.88795 1.08097 9.46599 0.65901C9.04403 0.237053 8.47174 0 7.875 0Z"
								fill="white"
							/>
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	</div>
	{#if $itemsInStack?.length > 0}
		<ModalStack />
	{/if}
	{#if $modalFullInfoStore}
		<Modal
			store={$modalFullInfoStore?.store}
			title={$modalFullInfoStore?.title}
			description={$modalFullInfoStore?.description}
			slides={$modalFullInfoStore?.slides}
		/>
	{/if}
</div>

{#if $searchResultsStore?.length > 0}
	<SearchResults searchResults={$searchResultsStore} />
{/if}

{#if canShowLoader}
	<LoadingIndicator />
{/if}

<style>
	:global(body > div) {
		margin: 0;
		padding: 0;
	}
	.bg-container {
		height: 100%;
		width: 100%;
		background-image: var(--svg-bg);
		background-color: var(--color-secondary);
		background-repeat: repeat;
		background-size: 28%;
	}
	.bg-container.isBrowsePage {
		background-image: none;
	}
	@media (max-width: 768px) {
		.bg-container {
			background-size: 50%;
		}
	}
	@media (max-width: 480px) {
		.bg-container {
			background-size: 100%;
		}
	}
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		max-width: 100%;
		padding-top: 47px;
		background-color: var(--color-secondary);
	}
	main.isPlayPage {
		padding-top: 57px;
	}
	main.isMobile {
		padding-top: 10px;
	}
	main.isPlayPage.isMobile {
		padding-top: 0px !important;
	}
	:global(.main) {
		/* margin: 10px; */
		height: calc(100% - 20px);
		width: calc(100% - 10px);
		max-width: calc(100%);
	}
	main.editor {
		height: calc(100% - 66.5px) !important;
	}
	@media (min-width: 498px) {
		main.editor {
			height: calc(100% - 56.5px) !important;
			/* padding-top: 0 !important; */
		}
		main.editor.hideUtilBar {
			height: calc(100% - 10px) !important;
			top: -45px;
		}
	}
	main.showSideBar {
		width: calc(100% - 230px);
		left: 230px;
		position: relative;
		background-color: var(--color-secondary);
	}
	:global(.main.showSideBar) {
		width: calc(100% - 230px);
	}
	ul ul {
		flex-grow: 1;
	}

	ul ul li {
		justify-content: flex-start;
		display: flex;
		flex-direction: row;
		gap: 10px;
	}
	.profile-info {
		justify-content: flex-end;
		/* position: absolute;
		top: 10px;
		left: 70px; */
	}
	.isProfilePage {
		height: calc(100% - 0px);
		/* overflow-y: scroll; */
		/* background-color: var(--color-secondary); */
		background-color: var(--darker-bg);
	}

	.isProfilePage {
		overflow: hidden;
	}
	.layout-container.isBrowsePage {
		background-color: var(--color-secondary);
	}
	.bg-container.engineInRoute {
		background-color: var(--color-secondary) !important;
	}
	.bg-container.gameProfile {
		background-color: var(--color-secondary) !important;
		display: flex;
	}
	::-webkit-scrollbar-thumb:hover {
		/* background: #555 !important; */
		cursor: pointer !important;
	}
	.page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	.page-container.isBrowsePage,
	.page-container.isUserGamesBrowsePage,
	.page-container.isUserFavoritesBrowsePage {
		overflow-y: scroll;
	}
	/* 	
	.page-container:active,
	.page-container:focus {
		overflow-y: scroll;
	} */
	:global(body) {
		scrollbar-width: thin !important;
	}

	.page-container::-webkit-scrollbar {
		background: transparent;
		display: none;
	}

	.page-container::-webkit-scrollbar-track {
		background: transparent;
		/* width: 0px; */
	}

	.page-container::-webkit-scrollbar:hover {
		/* cursor: pointer; */
		background-color: transparent;
	}

	.page-container::-webkit-scrollbar-thumb {
		/* background: #b9b9b9; */
		/* border-radius: 6px; */
		background-color: transparent;
	}

	.page-container::-webkit-scrollbar-thumb:hover {
		/* background: #555 !important; */
		/* cursor: pointer; */
		background-color: transparent;
	}
	.page-container.isGameProfile {
		overflow: hidden !important;
	}
	.sidebar {
		width: 230px;
		display: none;
		height: 100%;
		background-color: var(--menu-bg);

		flex-direction: column;
		position: fixed;
	}
	@media (max-width: 498px) {
		.sidebar {
			width: 100%;
			z-index: 1;
			overflow-y: scroll;
			overflow-x: hidden;
			background-color: var(--meun-blur-bg) !important;
			backdrop-filter: saturate(180%) blur(20px);
		}
		.sidebar-action ul a.active {
			background-color: #2b2c2ded !important;
		}
		.profile-info.showSideBar {
			position: absolute;
			right: 0;
		}
	}
	.sidebar.showSideBar {
		display: flex;
		z-index: 8;
	}
	.sidebar-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
	}
	.sidebar-section h3 {
		font-size: 1.1rem;
		font-family: var(--action-font) !important;
		color: var(--color-primary);
		margin: 0;
		margin-inline-start: 5px;
	}
	.sidebar-section ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		list-style: none;
		padding-inline-start: 10px;
	}
	.sidebar-section ul a,
	.sidebar-section ul .sidebar-action {
		display: flex;
		flex-direction: row;
		gap: 25px;
		color: var(--color-primary);
		padding-block: 0;
		border-width: 0;
		border-top-width: 0px;
		border-right-width: 0px;
		border-bottom-width: 0px;
		border-left-width: 0px;
		border-radius: 4px;
		padding: 10px;
		margin-right: 10px;
		text-decoration: none;
		font-size: 0.9rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
	}

	.sidebar-section ul a svg,
	.sidebar-section ul .sidebar-action svg {
		height: 1.6rem;
		width: 1.6rem;
		fill: var(--color-primary);
	}

	.sidebar-section ul a:hover,
	.sidebar-section ul .sidebar-action:hover {
		background-color: var(--sidbar-highlight);
		color: var(--color-primary);
		cursor: pointer;
	}
	.sidebar-section ul a.active {
		background-color: var(--sidbar-highlight);
		color: var(--color-primary);
	}
	.sidebar-action :global(button) {
		background-color: transparent !important;
		padding: 0 !important;
		font-size: 0.9rem !important;
	}
	.sidebar-divider {
		border: 1px solid #f6f6f605;
		border-radius: 25px;
		width: 90%;
	}
	.sidebar.engineInRoute.sidebar.showSideBar {
		border-top-right-radius: 6px;
	}
	.sidebar-toggle {
		position: absolute;
	}
	.sidebar-toggle.showSideBar {
		left: -220px;
		z-index: 10;
	}

	#primary-actions {
		margin-block-start: 40px;
	}
	main.editor.isPlayPage.isMobile {
		height: calc(100% - 10px) !important;
	}
	main.isPlayPage.isMobile {
		padding-top: 0px;
	}
	.sidebar-toggle.isMobile {
		bottom: 30px;
		left: 30px;
		list-style: none;
		z-index: 100000;
	}

	li.sidebar-toggle.engineInRoute {
		position: initial !important;
	}
	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: none;
	}
	.action-button:hover {
		cursor: pointer;
	}
	.action-button-icon {
		width: 36.5px;
		height: 100%;
		filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3));
	}
	.play-button-container {
		position: absolute;
		bottom: 30px;
		right: 26px;
		height: 50px;
		top: 11px;
	}
	.play-button {
		position: relative;
		z-index: 1;
		width: 36.5px;
		height: 36.5px;
		border-radius: 6px;
		transform: translateY(calc(var(--screenHeight))); /*  - 50px */
		/* top: 50px; */
	}
	.play-button.drawerOpen {
		transform: translateY(370%);
		transition: transform 0.01s linear 0.03s;
	}
	.play-button.drawerOpen svg {
		filter: brightness(0.4);
	}

	@media (max-width: 768px) {
		.play-button-container {
			top: -34px;
		}
	}
	@media (max-width: 498px) {
		main.editor.isPlayPage.isMobile {
			height: 100% !important;
		}
	}

	.play-button-container.fade svg path {
		fill: white;
	}
	.page-container.engineInRoute main.editor {
		padding-top: 0 !important;
		height: unset !important;
	}

	@media (min-width: 498px) {
		.play-button-container {
			bottom: 20px !important;
			top: unset !important;
			z-index: 0;
			right: 36.5px;
		}
		.play-button {
			transform: unset !important;
		}
	}
	.engineInRoute #primary-actions {
		margin-block-start: 0px;
	}
	@media (max-width: 498px) {
		.play-button-container {
			bottom: 20px !important;
			top: unset !important;
			z-index: 0;
			right: 26.5px;
		}
		.play-button {
			transform: unset !important;
		}
	}
	.play-button svg {
		filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3));
	}

	.play-button.showLoading {
		pointer-events: none;
		opacity: 0;
	}

	main.isProfilePage.isMobile {
		padding-top: 0px !important;
	}
	.divider {
		width: 42px;
		height: 150px;
		background-color: #ffffff24;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		bottom: 11vh;
		right: 35px;
		z-index: 1;
	}
	@media (max-width: 498px) {
		.divider {
			/* height: 100px; */
			right: 25px;
			bottom: 12vh;
		}
	}
	.divider .slider-action svg {
		width: 100%;
		fill: white;
	}
	.slider-action.top-icon {
		padding-top: 5px;
	}
	.slider-action.bottom-icon {
		padding-bottom: 5px;
	}
	.slider-action:hover {
		cursor: pointer;
	}

	/* LOADING Indicator Positioning */
	main.showLoading {
		filter: saturate(180%) blur(20px);
	}
	main.showLoading.showSideBar :global(.loader) {
		right: 230px;
	}
	@media (min-width: 498px) {
		.engineInRoute :global(#split-3) {
			/* height: 100% !important; */
		}
	}
	.sidebar-item.muted span {
		opacity: 0.3;
	}
	.sidebar-action.muted svg,
	.sidebar-item.muted svg {
		fill-opacity: 0.3;
		opacity: 0.3;
	}
	.sidebar-action.muted:hover,
	.sidebar-item.muted:hover,
	.sidebar-action.muted svg:hover,
	.sidebar-item.muted svg:hover {
		cursor: not-allowed;
		/* fill-opacity: 0.3;
		opacity: 0.3; */
	}
	.sidebar-action.muted:hover {
		cursor: not-allowed !important;
	}
	.page-container :global(.engineInRoute.addPaddingToEditorStore) {
		height: calc(100%) !important;
		padding-top: 20px !important;
		max-height: calc(100%) !important;
	}
</style>
