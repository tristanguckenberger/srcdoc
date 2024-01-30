<script>
	// @ts-nocheck
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	// SVELTE IMPORTS
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { slide, fade } from 'svelte/transition';

	// CUSTOM STORE IMPORTS
	import {
		playButton,
		actionMenuOpen,
		screenshot,
		currentGame,
		gameFavoriteCount,
		gameFavorites
	} from '$lib/stores/gamesStore.js';
	import {
		autoCompile,
		fileSystemSidebarOpen,
		triggerCompile,
		filesToUpdate,
		focusedFileId,
		initialDataStore
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

	// COMPONENT IMPORTS
	import Modal from '$lib/ui/Modal/index.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	// ASSET IMPORTS
	import bgFadedMono16 from '$lib/assets/bgFadedMono16.svg';
	import { beforeNavigate } from '$app/navigation';

	// PROPS
	export let sessionData; // TODO, ensure this isn't being used and remove it
	export let data; // This is the data from the server, includes `sessionData`

	// Variables
	const browseOptions = [{ option: 'Home' }, { option: 'Quick Play' }, { option: 'Favorites' }];
	let preferedThemeMode;
	let dropDownToggle = false;
	let isFavorited = false;
	let deleteOrCreateFav = false;

	// FUNCTIONS
	onMount(() => {
		if (browser) {
			preferedThemeMode = window?.matchMedia('(prefers-color-scheme: light)');
			preferedThemeMode?.addEventListener('change', updateTheme);
			updateTheme(preferedThemeMode);
			if (sessionData && !$session) {
				session.set(sessionData);
			}
		}
	});
	beforeNavigate(() => {
		isFavorited = false;
	});
	afterUpdate(() => {
		$gameFavorites?.favorites?.some((fav) => {
			isFavorited = fav?.user_id === sessionData?.id ?? false;
		});

		deleteOrCreateFav = isFavorited ?? false;

		console.log('deleteOrCreateFav::', deleteOrCreateFav);
	});
	onDestroy(() => {
		preferedThemeMode?.removeListener(updateTheme);
	});
	const toggleFileSystemSidebar = () => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen);
	const updateTheme = (e) => {
		themeKeyStore.set(e.matches ? 'light' : 'dark');
	};
	const toggleDropDown = () => {
		dropDownToggle = !dropDownToggle;
	};
	const toggleSideBar = () => {
		$sideBarState = !$sideBarState;
	};
	const handleSave = async () => {
		const fileToUpdate = $filesToUpdate?.find((file) => file.id === $focusedFileId);
		const name = fileToUpdate?.name;
		const type = fileToUpdate?.type;
		const content = fileToUpdate?.content;
		const gameId = fileToUpdate?.game_id ?? fileToUpdate?.gameId;
		const parentFileId = fileToUpdate?.parentFileId ?? fileToUpdate?.parent_file_id;
		const fileId = fileToUpdate?.id;

		if (fileId && name && type && gameId && parentFileId) {
			const updatedFile = await fetch(`/api/updateFile`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fileId: fileToUpdate?.id,
					gameId,
					name,
					type,
					content,
					parentFileId
				})
			});

			if (updatedFile?.ok) {
				// If the file successfully updated:
				// - remove it from the filesToUpdate array
				// - update the initialDataStore so we can check for future changes
				const updatedData = $initialDataStore?.files?.map((file) => {
					if (file?.id === fileId) {
						file.content = content;
					}
					return file;
				});

				$filesToUpdate = $filesToUpdate?.filter((file) => file?.id !== fileId);
				// Since only files are updated, we can spread all the existing data and just update the files
				// also need to remove the sessionData, that shouldnt be in there
				initialDataStore?.set({
					...$initialDataStore,
					files: JSON.parse(JSON.stringify(updatedData)),
					sessionData: null
				});
			}
		}
	};
	const toggleDrawer = () => {
		drawerOpen.set(true);
	};
	const playToggle = () => {
		if ($drawerOpen) {
			$playButton = false;
		} else {
			$playButton = !play;
		}
	};

	// REACTIVE VARIABLES & STATEMENTS
	$: currentBrowseOptionSelection = browseOptions[0];
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isVerifyPage = splitPath[splitPath?.length - 1] === 'verify';
	$: isProfilePage =
		splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main');
	$: isBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' ||
		(splitPath[1] === 'users' && !isProfilePage && !splitPath.some((path) => path === 'users'));
	$: isUserGamesBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users';
	$: isUserFavoritesBrowsePage =
		splitPath[splitPath?.length - 1] === 'favorites' && splitPath[1] === 'games';

	$: isHomePage = $page?.route?.id === '/';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
	$: sessionData = data?.sessionData ?? $session;
	$: modalIsOpen = $modalOpenState;
	$: isPlayPage = $page?.route?.id === '/games/[slug]/play';
	$: isMobile = $appClientWidth < 768;
	$: play = $playButton;
	$: actionOpen = $actionMenuOpen;
	$: console.log('routeHistory:', $routeHistoryStore);
	$: actionHideDuration = $drawerOpen ? 0 : 200;
	$: console.log('gameFav::gameFavorites::', $gameFavorites?.favorites?.includes(sessionData?.id));
	$: console.log('gameFav::sessionData::', sessionData);
	// $: isFavorited = sessionData && $gameFavorites?.includes(sessionData?.id);
	$: (() => {
		$gameFavorites?.favorites?.some((fav) => {
			isFavorited = fav?.user_id === sessionData?.id ?? false;
		});
	})();
	// $: deleteOrCreateFav = isFavorited ?? false;
	// $: console.log('deleteOrCreateFav::', deleteOrCreateFav);
</script>

<div
	class="layout-container"
	class:isBrowsePage
	style="--svg-bg: url('{bgFadedMono16}'); --screenHeight: {$screenHeight -
		15}px; height: 100%; width: 100%; {themeString}"
>
	<div
		class="bg-container"
		style="height: 100%; width: 100%;"
		class:isBrowsePage
		class:engineInRoute
		class:gameProfile={(isProfilePage || playInRoute) && !engineInRoute}
		bind:clientWidth={$appClientWidth}
	>
		<nav
			class="top"
			class:matchGridWidth={!engineInRoute && isBrowsePage}
			class:isNotHomePage={!isHomePage}
			class:engineInRoute
			class:isHomePage
			class:gameProfile={(isProfilePage || playInRoute) && !engineInRoute}
			class:showSideBar={$sideBarState}
			class:isBrowsePage
			class:isUserGamesBrowsePage
			class:isUserFavoritesBrowsePage
			class:isPlayPage
			class:isMobile
		>
			<ul class:matchGridWidth={!engineInRoute && isBrowsePage}>
				<ul>
					{#if engineInRoute}
						<li class:hiddenItem={!engineInRoute}>
							<Button
								action={toggleFileSystemSidebar}
								label={$fileSystemSidebarOpen ? 'close' : 'open'}
								link={null}
							/>
						</li>
					{:else}
						<li class="sidebar-toggle" class:showSideBar={$sideBarState}>
							<Button action={toggleSideBar} label={$sideBarState ? 'close' : 'open'} link={null} />
						</li>
					{/if}
					{#if engineInRoute}
						<li class:hiddenItem={!engineInRoute && !$autoCompile}>
							<Button
								action={() => triggerCompile.set(!$triggerCompile)}
								label={playPauseLabel}
								link={null}
							/>
						</li>
					{/if}
					{#if engineInRoute}
						<li class:hiddenItem={!engineInRoute}>
							<Button action={handleSave} label={'save'} link={null} />
						</li>
					{/if}
				</ul>
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
					<div class="more-container" class:dropDownToggle>
						<div class="more" class:dropDownToggle class:isBrowsePage>
							<ul>
								<li>
									<Button label="Home" link="/games" />
								</li>
								<li>
									<form class="logout-form" action="/?/logout" method="POST">
										<Button class="logout" label="Logout" />
									</form>
								</li>
							</ul>
						</div>
					</div>
				</ul>
			</ul>
		</nav>
		{#if modalIsOpen}
			<Modal />
		{/if}
		<div
			class="page-container"
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
						<a href="/games/favorites" class:active={isUserFavoritesBrowsePage}>
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
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<h3>Explore</h3>
					<ul>
						<a href="/trending">
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
						<a href="/top?rated">
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
						<a href="/top?played">
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
						<a href="/new">
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
							href="/users/{sessionData?.id}/games"
							class:active={isUserGamesBrowsePage}
							class="sidebar-item"
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
						<div class="sidebar-action">
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
								<Button class="new-project" label="New Project" />
							</form>
						</div>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<ul>
						<a href="/settings">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm92-27.21v-1.58l14-17.51a12,12,0,0,0,2.23-10.59A111.75,111.75,0,0,0,225,71.89,12,12,0,0,0,215.89,66L193.61,63.5l-1.11-1.11L190,40.1A12,12,0,0,0,184.11,31a111.67,111.67,0,0,0-27.23-11.27A12,12,0,0,0,146.3,22L128.79,36h-1.58L109.7,22a12,12,0,0,0-10.59-2.23A111.75,111.75,0,0,0,71.89,31.05,12,12,0,0,0,66,40.11L63.5,62.39,62.39,63.5,40.1,66A12,12,0,0,0,31,71.89,111.67,111.67,0,0,0,19.77,99.12,12,12,0,0,0,22,109.7l14,17.51v1.58L22,146.3a12,12,0,0,0-2.23,10.59,111.75,111.75,0,0,0,11.29,27.22A12,12,0,0,0,40.11,190l22.28,2.48,1.11,1.11L66,215.9A12,12,0,0,0,71.89,225a111.67,111.67,0,0,0,27.23,11.27A12,12,0,0,0,109.7,234l17.51-14h1.58l17.51,14a12,12,0,0,0,10.59,2.23A111.75,111.75,0,0,0,184.11,225a12,12,0,0,0,5.91-9.06l2.48-22.28,1.11-1.11L215.9,190a12,12,0,0,0,9.06-5.91,111.67,111.67,0,0,0,11.27-27.23A12,12,0,0,0,234,146.3Zm-24.12-4.89a70.1,70.1,0,0,1,0,8.2,12,12,0,0,0,2.61,8.22l12.84,16.05A86.47,86.47,0,0,1,207,166.86l-20.43,2.27a12,12,0,0,0-7.65,4,69,69,0,0,1-5.8,5.8,12,12,0,0,0-4,7.65L166.86,207a86.47,86.47,0,0,1-10.49,4.35l-16.05-12.85a12,12,0,0,0-7.5-2.62c-.24,0-.48,0-.72,0a70.1,70.1,0,0,1-8.2,0,12.06,12.06,0,0,0-8.22,2.6L99.63,211.33A86.47,86.47,0,0,1,89.14,207l-2.27-20.43a12,12,0,0,0-4-7.65,69,69,0,0,1-5.8-5.8,12,12,0,0,0-7.65-4L49,166.86a86.47,86.47,0,0,1-4.35-10.49l12.84-16.05a12,12,0,0,0,2.61-8.22,70.1,70.1,0,0,1,0-8.2,12,12,0,0,0-2.61-8.22L44.67,99.63A86.47,86.47,0,0,1,49,89.14l20.43-2.27a12,12,0,0,0,7.65-4,69,69,0,0,1,5.8-5.8,12,12,0,0,0,4-7.65L89.14,49a86.47,86.47,0,0,1,10.49-4.35l16.05,12.85a12.06,12.06,0,0,0,8.22,2.6,70.1,70.1,0,0,1,8.2,0,12,12,0,0,0,8.22-2.6l16.05-12.85A86.47,86.47,0,0,1,166.86,49l2.27,20.43a12,12,0,0,0,4,7.65,69,69,0,0,1,5.8,5.8,12,12,0,0,0,7.65,4L207,89.14a86.47,86.47,0,0,1,4.35,10.49l-12.84,16.05A12,12,0,0,0,195.88,123.9Z"
								/></svg
							>
							<span>Settings</span>
						</a>
						{#if sessionData?.id && !sessionData?.is_active && !$session?.is_active}
							<a href="/users/{sessionData?.id}/verify" class:active={isVerifyPage}>
								Account Verfication
							</a>
						{/if}
						{#if !sessionData?.username && !$session?.username}
							<a href="/" class:active={isHomePage}>Sign In or Register</a>
						{/if}
						{#if (sessionData?.username || $session?.username) && isMobile}
							<li class="mobile-profile-btn">
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
				</div>
			</div>
			<main
				class:isProfilePage
				class:scrollable={!engineInRoute && !playInRoute && isBrowsePage}
				class:editor={(engineInRoute || playInRoute) && !isBrowsePage}
				class:showSideBar={$sideBarState}
				class:isPlayPage
				class:isMobile
				style={`${themeString}`}
			>
				<slot />
			</main>
			{#if isMobile && !$playButton}
				<li class="sidebar-toggle isMobile" class:showSideBar={$sideBarState}>
					<Button action={toggleSideBar} label={$sideBarState ? 'close' : 'open'} link={null} />
				</li>
			{/if}
			{#if isPlayPage}
				{#if !$playButton}
					{#if !$drawerOpen}
						<ul class="action-menu" class:fade={$actionMenuOpen}>
							<!-- {#if $actionMenuOpen} -->
							<div class="sub-action-menu">
								<a class="action-button button" href={`/games/${$currentGame?.id}/engine`}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="36"
										height="36"
										fill="#ffffff"
										viewBox="0 0 256 256"
										><path
											d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"
										/></svg
									>
								</a>
								<form
									class="gameDetails new-project-form modal"
									method="POST"
									action="/games/?/{isFavorited ? 'deleteFavorite' : 'createFavorite'}"
									use:enhance={({ formElement, formData, action, cancel, redirect }) => {
										return async ({ result }) => {
											if (result.status === 200) {
												gameFavorites.set(result?.data?.body?.favorites);
												gameFavoriteCount.set(result?.data?.body?.favorites?.length);
												isFavorited = !isFavorited;
											}
										};
									}}
								>
									<input type="hidden" name="gameId" value={$currentGame?.id} />
									<button class="action-button button favorites" on:click={() => {}}>
										<!-- {#if isFavorited && $gameFavoriteCount > 0} -->
										<svg
											width="27"
											height="23"
											viewBox="0 0 27 23"
											fill="red"
											xmlns="http://www.w3.org/2000/svg"
											class="fav"
											class:isFavorited={isFavorited && $gameFavoriteCount > 0}
										>
											<path
												d="M26.21 7.25455C26.21 15.4452 14.0656 22.0749 13.5485 22.3487C13.4122 22.422 13.2598 22.4604 13.105 22.4604C12.9502 22.4604 12.7978 22.422 12.6615 22.3487C12.1444 22.0749 0 15.4452 0 7.25455C0.00216787 5.33119 0.767181 3.48723 2.1272 2.1272C3.48723 0.767181 5.33119 0.00216787 7.25455 0C9.67079 0 11.7863 1.03904 13.105 2.79534C14.4237 1.03904 16.5392 0 18.9554 0C20.8788 0.00216787 22.7228 0.767181 24.0828 2.1272C25.4428 3.48723 26.2078 5.33119 26.21 7.25455Z"
												fill="white"
												fill-opacity="0.81"
											/>
										</svg>
										<span class="favorite">{$gameFavoriteCount ?? 0}</span>
									</button>
								</form>
								<button
									class="action-button button"
									on:click={() => {
										$playButton = false;
										browser && selectedOption.set(0);
										// setTimeout(() => {
										// playToggle();
										$playButton = false;
										drawerOpen.set(true);
										// }, 200);
									}}
								>
									<svg
										width="27"
										height="27"
										viewBox="0 0 27 27"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M17.8228 11.5324C17.8228 11.8105 17.7123 12.0771 17.5157 12.2737C17.3191 12.4703 17.0525 12.5808 16.7744 12.5808H8.3872C8.10915 12.5808 7.84248 12.4703 7.64587 12.2737C7.44926 12.0771 7.3388 11.8105 7.3388 11.5324C7.3388 11.2543 7.44926 10.9877 7.64587 10.7911C7.84248 10.5945 8.10915 10.484 8.3872 10.484H16.7744C17.0525 10.484 17.3191 10.5945 17.5157 10.7911C17.7123 10.9877 17.8228 11.2543 17.8228 11.5324ZM16.7744 14.6776H8.3872C8.10915 14.6776 7.84248 14.7881 7.64587 14.9847C7.44926 15.1813 7.3388 15.4479 7.3388 15.726C7.3388 16.0041 7.44926 16.2707 7.64587 16.4673C7.84248 16.6639 8.10915 16.7744 8.3872 16.7744H16.7744C17.0525 16.7744 17.3191 16.6639 17.5157 16.4673C17.7123 16.2707 17.8228 16.0041 17.8228 15.726C17.8228 15.4479 17.7123 15.1813 17.5157 14.9847C17.3191 14.7881 17.0525 14.6776 16.7744 14.6776ZM26.21 13.105C26.2062 16.5795 24.8243 19.9106 22.3674 22.3674C19.9106 24.8243 16.5795 26.2062 13.105 26.21H2.05355C1.50913 26.2093 0.987204 25.9927 0.602238 25.6078C0.217272 25.2228 0.000693534 24.7009 0 24.1564V13.105C5.17914e-08 9.62934 1.3807 6.29603 3.83837 3.83837C6.29603 1.3807 9.62934 0 13.105 0C16.5807 0 19.914 1.3807 22.3716 3.83837C24.8293 6.29603 26.21 9.62934 26.21 13.105ZM24.1132 13.105C24.1132 10.1854 22.9534 7.38547 20.889 5.32103C18.8245 3.25659 16.0246 2.0968 13.105 2.0968C10.1854 2.0968 7.38546 3.25659 5.32103 5.32103C3.25659 7.38547 2.0968 10.1854 2.0968 13.105V24.1132H13.105C16.0236 24.1101 18.8218 22.9493 20.8855 20.8855C22.9493 18.8218 24.1101 16.0236 24.1132 13.105Z"
											fill="white"
											fill-opacity="0.81"
										/>
									</svg>
								</button>
								<button
									class="action-button button"
									on:click={() => {
										// $playButton = false;
									}}
								>
									<svg
										width="27"
										height="16"
										viewBox="0 0 27 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14.3734 2.53932C14.3734 2.31509 14.4625 2.10004 14.621 1.94149C14.7796 1.78293 14.9947 1.69385 15.2189 1.69385H25.3645C25.5888 1.69385 25.8038 1.78293 25.9624 1.94149C26.1209 2.10004 26.21 2.31509 26.21 2.53932C26.21 2.76356 26.1209 2.97861 25.9624 3.13716C25.8038 3.29572 25.5888 3.38479 25.3645 3.38479H15.2189C14.9947 3.38479 14.7796 3.29572 14.621 3.13716C14.4625 2.97861 14.3734 2.76356 14.3734 2.53932ZM25.3645 6.76667H15.2189C14.9947 6.76667 14.7796 6.85575 14.621 7.01431C14.4625 7.17286 14.3734 7.38791 14.3734 7.61214C14.3734 7.83638 14.4625 8.05143 14.621 8.20998C14.7796 8.36854 14.9947 8.45761 15.2189 8.45761H25.3645C25.5888 8.45761 25.8038 8.36854 25.9624 8.20998C26.1209 8.05143 26.21 7.83638 26.21 7.61214C26.21 7.38791 26.1209 7.17286 25.9624 7.01431C25.8038 6.85575 25.5888 6.76667 25.3645 6.76667ZM25.3645 11.8395H17.7553C17.5311 11.8395 17.316 11.9286 17.1575 12.0871C16.9989 12.2457 16.9098 12.4607 16.9098 12.685C16.9098 12.9092 16.9989 13.1242 17.1575 13.2828C17.316 13.4414 17.5311 13.5304 17.7553 13.5304H25.3645C25.5888 13.5304 25.8038 13.4414 25.9624 13.2828C26.1209 13.1242 26.21 12.9092 26.21 12.685C26.21 12.4607 26.1209 12.2457 25.9624 12.0871C25.8038 11.9286 25.5888 11.8395 25.3645 11.8395ZM10.7051 9.09172C11.5442 8.44542 12.16 7.55269 12.4661 6.53874C12.7721 5.52478 12.7531 4.44046 12.4118 3.43783C12.0704 2.43521 11.4238 1.56458 10.5626 0.948048C9.70138 0.331514 8.6688 0 7.60966 0C6.55052 0 5.51794 0.331514 4.65673 0.948048C3.79553 1.56458 3.14891 2.43521 2.80754 3.43783C2.46618 4.44046 2.44719 5.52478 2.75326 6.53874C3.05932 7.55269 3.67508 8.44542 4.51418 9.09172C2.33498 10.0143 0.61762 11.8712 0.0268472 14.1645C-0.00542023 14.2895 -0.00864689 14.4202 0.0174145 14.5466C0.0434758 14.673 0.0981333 14.7918 0.177198 14.8938C0.256262 14.9958 0.357635 15.0784 0.473545 15.1352C0.589455 15.192 0.716827 15.2214 0.845896 15.2214H14.3734C14.5025 15.2214 14.6299 15.192 14.7458 15.1352C14.8617 15.0784 14.9631 14.9958 15.0421 14.8938C15.1212 14.7918 15.1758 14.673 15.2019 14.5466C15.228 14.4202 15.2247 14.2895 15.1925 14.1645C14.6017 11.8701 12.8843 10.0133 10.7051 9.09172Z"
											fill="white"
											fill-opacity="0.81"
										/>
									</svg>
								</button>
							</div>
						</ul>
					{/if}
				{/if}

				<div class="play-button-container" class:fade={$actionMenuOpen}>
					<button
						class="action-button play-button"
						class:drawerOpen={$drawerOpen}
						on:click={playToggle}
						class:fade={$actionMenuOpen}
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
	</div>
</div>

<style>
	:global(body > div) {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		background: hsla(32, 29%, 57%, 1) !important;
		background: linear-gradient(135deg, #beac98 0%, hsla(245, 29%, 57%, 1) 100%) !important;
		background: -moz-linear-gradient(135deg, #beac98 0%, hsla(245, 29%, 57%, 1) 100%) !important;
		background: -webkit-linear-gradient(333deg, #beac98 0%, hsla(245, 29%, 57%, 1) 100%) !important;
	}
	.bg-container {
		height: 100%;
		width: 100%;
		background-image: var(--svg-bg);
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
		padding-top: 56.5px;
	}
	main.isProfilePage {
		padding-top: 56.5px;
	}
	main.isMobile {
		padding-top: 10px !important;
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
	nav {
		color: var(--color-primary);
		padding: 10px 10px;
		position: fixed;
		top: 0;
		z-index: 10;
		width: calc(100% - 20px);
		background: #121314;
	}
	nav.isHomePage {
		background: transparent;
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 10px;
		align-items: center;
		height: 36.5px;
		width: 100%;
	}

	nav.matchGridWidth {
		justify-content: flex-start;
		display: flex;
	}
	li.hiddenItem {
		display: none;
	}
	main.editor {
		height: calc(100% - 66.5px) !important;
	}
	main.showSideBar {
		width: calc(100% - 230px);
		left: 230px;
		position: relative;
		background-color: #121314;
	}
	:global(.main.showSideBar) {
		width: calc(100% - 230px);
	}
	/* .home {
		justify-self: flex-end;
	} */
	ul.matchGridWidth {
		/* width: calc(var(--nav-width) - 20px); */
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
	}
	.isProfilePage {
		height: calc(100% - 66.5px);
		/* overflow-y: scroll; */
		/* background-color: var(--color-secondary); */
		background-color: var(--darker-bg);
	}

	.isProfilePage {
		overflow: hidden;
	}

	.more-container {
		position: relative;
		display: none;
	}
	.more-container.dropDownToggle {
		display: block;
		left: 10px;
	}
	.more {
		display: none;
		gap: 9px;
		align-items: center;
		opacity: 0;
		transition: opacity 0.5s linear;
	}
	.more.dropDownToggle {
		display: flex;
		height: 150px;
		width: 200px;
		background-color: var(--button-highlight);
		position: absolute;
		top: 18px;
		right: 10px;
		z-index: 100;
		border-radius: 12px;
		border-top-right-radius: 0px;
		opacity: 1;
	}
	.more.isBrowsePage {
		right: 10px;
	}
	.more ul {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		padding: 0 10px;
		flex-direction: column;
	}

	.more ul > li {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: fit-content;
		width: fit-content;
		padding-top: 10px;
	}
	.layout-container.isBrowsePage {
		background-color: var(--darker-bg);
	}
	.bg-container.engineInRoute {
		background-color: var(--darker-bg) !important;
	}
	.bg-container.gameProfile {
		background-color: var(--darker-bg) !important;
		display: flex;
	}
	nav.engineInRoute {
		background-color: var(--darker-bg) !important;
	}
	nav.gameProfile {
		/* background-color: transparent !important; */
		background-color: #121314 !important;
	}
	nav.gameProfile.showSideBar {
		/* background-color: transparent !important; */
	}

	/* Handle on hover */
	/* body {
		scrollbar-width: thin;
		scrollbar-color: #4d7fff #ddd;
	}

	body::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	body::-webkit-scrollbar-thumb {
		background: linear-gradient(to bottom right, #4d7fff 0%, #1a56ff 100%);
		border-radius: 5px;
	}

	body::-webkit-scrollbar-track {
		background-color: #ddd;
		border: 1px solid #ccc;
	}

	body::-webkit-scrollbar-button {
		background-color: #4d7fff;
		border-radius: 5px;
	} */

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
		background-color: #1d1e20;

		flex-direction: column;
		position: fixed;
	}
	@media (max-width: 498px) {
		.sidebar {
			width: 100%;
			z-index: 1;
			overflow-y: scroll;
			overflow-x: hidden;
			background-color: #1c1d1fed !important;
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
	nav.showSideBar {
		color: var(--color-primary);
		padding: 10px;
		position: fixed;
		top: 0;
		left: 330px;
		z-index: 10;
		width: calc(100% - 350px);
		background: none;
		z-index: 9;
	}
	.sidebar-toggle {
		position: absolute;
	}
	.sidebar-toggle.showSideBar {
		left: -320px;
		z-index: 10;
	}

	#primary-actions {
		margin-block-start: 40px;
	}
	nav.isBrowsePage {
		/* padding: 10px 10px 0 20px; */
	}
	nav.isUserGamesBrowsePage,
	nav.isUserFavoritesBrowsePage {
		padding: 10px 10px 0 10px;
	}
	nav.isMobile {
		display: none;
	}
	nav.isMobile.engineInRoute {
		display: block;
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
	}
	.play-button-container {
		position: absolute;
		bottom: 30px;
		right: 26px;
		height: 50px;
		top: 11px;
	}
	.action-menu {
		position: absolute;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-items: center;
		bottom: 81.5px;
		right: 25px;
	}

	.sub-action-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-items: center;
	}
	.action-menu .button {
		transition: transform 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
	}
	.action-menu .button.actionMenuOpen {
		transform: rotate(90deg);
	}
	.play-button {
		position: relative;
		z-index: 1;
		width: 36.5px;
		height: 36.5px;
		border-radius: 6px;

		transform: translateY(var(--screenHeight));
	}
	.play-button.drawerOpen {
		transform: translateY(370%);
		transition: transform 0.3s linear 0.03s;
	}
	.play-button.drawerOpen svg {
		filter: brightness(0.4);
	}

	@media (max-width: 768px) {
		.play-button-container {
			top: -34px;
		}
	}
	.favorites {
		font-family: 'Inter';
		color: #dadada;
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-weight: 400;
		text-shadow: 0 0 3px black;
	}
	svg.fav path {
		/* transition: fill 0.3s ease; */
	}
	svg.isFavorited path {
		fill: red;
	}
	.action-menu button:focus {
		outline: none;
	}
	.action-menu button:focus-within {
		outline: none;
	}
	.action-menu button:focus-visible {
		outline: none;
	}
	.mobile-profile-btn {
		display: flex;
		align-items: center;
		padding-left: 10px;
	}
	@media (max-width: 498px) {
		main.editor.isPlayPage.isMobile {
			height: 100% !important;
		}
	}

	.play-button-container,
	.action-menu {
		opacity: 0;
		transition: opacity 0.3s linear 0.03s;
	}

	.play-button-container.fade,
	.action-menu.fade {
		opacity: 1;
		transition: opacity 0.3s linear 0.06s;
	}
</style>
