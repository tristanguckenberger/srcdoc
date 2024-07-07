<script>
	// @ts-nocheck
	// SVELTE IMPORTS
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	// SVELTE IMPORTS
	import { afterUpdate, onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	// CUSTOM STORE IMPORTS
	import { gameFavorites } from '$lib/stores/gamesStore.js';
	import {
		autoCompile,
		fileSystemSidebarOpen,
		triggerCompile,
		filesToUpdate,
		focusedFileId,
		initialDataStore
	} from '$lib/stores/filesStore';
	import { sideBarState, appClientWidth } from '$lib/stores/layoutStore.js';
	import { session } from '$lib/stores/sessionStore.js';
	import { platformSession } from '$lib/stores/platformSession';
	import { themeKeyStore } from '$lib/stores/themeStore';
	import { routeHistoryStore } from '$lib/stores/routeStore';
	import { itemsInStack } from '$lib/stores/modalStackStore';

	// COMPONENT IMPORTS
	import Button from '$lib/ui/Button/index.svelte';
	import SearchBar from '$lib/ui/NavWidgets/SearchBar.svelte';
	import Notifications from '$lib/ui/Notifications/index.svelte';

	// ASSET IMPORTS
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { copyData } from '$lib/platformCopy/copyData.js';
	import { editorPageInfoStore, modalFullInfoStore } from '$lib/stores/InfoStore.js';
	import { notifications, showNotifications } from '$lib/stores/notificationStore';

	// Props
	export let data;
	export let sessionData;

	// Variables
	let preferedThemeMode;
	let dropDownToggle = false;
	let isFavorited = false;
	// let mainPageElement;
	let mainElement;
	let hasNewNotifications = false;
	// let showNotifications = false;
	const showBoxShadow = writable(false);

	// FUNCTIONS
	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });

		if (browser) {
			preferedThemeMode = window?.matchMedia('(prefers-color-scheme: light)');
			preferedThemeMode?.addEventListener('change', updateTheme);
			updateTheme(preferedThemeMode);
		}
	});

	afterUpdate(() => {
		const tickThenCheckForNotifications = async () => {
			await tick();
			// Check for new notifications
			console.log('notifications::', $notifications);
			hasNewNotifications =
				$notifications?.length > 0 && $notifications?.some((notification) => notification?.id);
		};

		tickThenCheckForNotifications();
	});

	afterNavigate(() => {
		// Reset the notifications
		$showNotifications = false;
		notifications.set([]);
	});

	const toggleFileSystemSidebar = () => {
		if (!playInRoute) {
			fileSystemSidebarOpen.set(!$fileSystemSidebarOpen);
			$sideBarState = false;
		}
	};

	const updateTheme = (e) => {
		themeKeyStore.set('dark');
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

	const handleSave = async () => {
		try {
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
					const saveGameSuccessModalCopy = copyData?.alertCopy?.game?.save?.success;

					$itemsInStack = [
						...$itemsInStack,
						{
							title: saveGameSuccessModalCopy.title,
							message: saveGameSuccessModalCopy.message,
							useTimeout: true
						}
					];
				}
			}
		} catch (error) {
			console.log('error::', error);
		}
	};

	const toggleEditorInfoModal = async () => {
		if (browser) {
			await tick();
			$modalFullInfoStore = $editorPageInfoStore?.info;
		}
	};

	const toggleShowNotifications = () => {
		if ($showNotifications) {
			updateNotifications().then(() => {
				$notifications = [];
				showNotifications.set(false);
			});
		} else {
			$showNotifications = !$showNotifications;
		}
	};

	const updateNotifications = async () => {
		const response = await fetch(`/api/notifications/update`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				ids: $notifications.map((notification) => notification.id)
			})
		});
		console.log('response::', await response.json());
	};

	// REACTIVE VARIABLES & STATEMENTS
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isHomePage = $page?.route?.id === '/';
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
	$: isPlayPage = $page?.route?.id === '/games/[slug]/play';
	$: isMobile = $appClientWidth < 768;
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
	$: (() => {
		$gameFavorites?.favorites?.some((fav) => {
			isFavorited = fav?.user_id === sessionData?.currentUser?.id ?? false;
		});
	})();
	$: previousRoute = $routeHistoryStore[$routeHistoryStore.length - 2];
	$: disableBackButton = $routeHistoryStore?.length < 2;
	$: console.log('hasNewNotifications::', hasNewNotifications);
	/**
	 * We have to reference the store to trigger the reactive statement
	 */
	$routeHistoryStore;
</script>

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
	class:showBoxShadow={$showBoxShadow}
>
	<ul class:matchGridWidth={!engineInRoute && isBrowsePage}>
		<ul>
			{#if engineInRoute}
				<li class="sidebar-toggle" class:showSideBar={$sideBarState} class:engineInRoute>
					<Button action={toggleSideBar} label={$sideBarState ? 'close' : 'open'} link={null} />
				</li>
				<li class:hiddenItem={!engineInRoute}>
					<Button
						action={toggleFileSystemSidebar}
						label={$fileSystemSidebarOpen ? 'close-folder' : 'open-folder'}
						link={null}
					/>
				</li>
			{:else}
				<li class="sidebar-toggle" class:showSideBar={$sideBarState}>
					<Button action={toggleSideBar} label={$sideBarState ? 'close' : 'open'} link={null} />
				</li>
				<li class="top-nav-action-bar" class:showSideBar={$sideBarState}>
					<div class="back-button-container">
						<a href={previousRoute} class="back-button" class:disableBackButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="#000000"
								viewBox="0 0 256 256"
								><path
									d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
								/></svg
							>
						</a>
					</div>
					<div class="search">
						<SearchBar />
					</div>
					<div>
						<button class={`notifications-button`} type="button" on:click={toggleShowNotifications}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="#ffffff"
								viewBox="0 0 256 256"
								><path
									d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
								/></svg
							>
							<div class="notification-alert" class:hasNewNotifications />
						</button>
					</div>
					{#if $showNotifications}
						<div class="notifications-container">
							<Notifications />
						</div>
					{/if}
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
			{#if engineInRoute}
				<li class:hiddenItem={!engineInRoute}>
					<Button action={toggleEditorInfoModal} label={'info'} link={null} />
				</li>
			{/if}
		</ul>
	</ul>
</nav>

<style>
	nav {
		color: var(--color-primary);
		padding: 10px 10px 0 10px;
		position: fixed;
		z-index: 10;
		width: calc(100% - 20px);
		/* background: var(--color-secondary); */
	}

	nav.isPlayPage {
		padding: 10px;
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
	nav.isBrowsePage {
		padding: 10px 10px 10px 10px;
	}
	li.hiddenItem {
		display: none;
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
		background-color: var(--nav-dropdown);
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
	nav.engineInRoute {
		background-color: var(--color-secondary) !important;
		position: unset !important;
	}
	nav.gameProfile {
		background-color: none !important;
	}
	::-webkit-scrollbar-thumb:hover {
		cursor: pointer !important;
	}
	:global(body) {
		scrollbar-width: thin !important;
	}
	@media (max-width: 498px) {
		.profile-info.showSideBar {
			position: absolute;
			right: 0;
		}
	}
	.sidebar-section ul a {
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

	.sidebar-section ul a:hover {
		background-color: var(--sidbar-highlight);
		color: var(--color-primary);
		cursor: pointer;
	}
	nav.showSideBar {
		color: var(--color-primary);
		padding: 10px;
		position: fixed;
		top: 0;
		left: 230px;
		z-index: 10;
		width: calc(100% - 250px);
		/* background: var(--color-secondary); */
		z-index: 9;
		transition: box-shadow 0.05s linear;
	}
	nav.showBoxShadow {
		box-shadow: var(--shadow);
	}
	nav.engineInRoute.showSideBar {
		width: calc(100% - 20px);
	}
	.sidebar-toggle {
		position: absolute;
	}
	nav.isHomePage .sidebar-toggle {
		bottom: 10px;
	}
	.sidebar-toggle.showSideBar {
		left: -220px;
		z-index: 10;
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
	li.sidebar-toggle.engineInRoute {
		position: initial !important;
	}
	.play-button-container.fade svg path {
		fill: white;
	}
	div.search {
		flex-grow: 1;
		max-width: calc(100% - 113px);
	}

	nav.showSideBar div.search {
		width: calc(100% - 250.5px);
		right: 10px;
	}

	/* DEV util styling */
	.top-nav-action-bar {
		display: flex;
		align-items: center;
		width: calc(100% - 45.5px);
		position: fixed;
		left: 56.5px;
		top: 10px;
	}
	.top-nav-action-bar.showSideBar {
		left: 240px;
		width: calc(100% - 229px);
	}
	nav.isHomePage .top-nav-action-bar {
		top: unset;
		bottom: 10px;
	}
	a.back-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25em;
		background-color: var(--home-gradient-color-1);
		border: none;
		height: 36px;
		width: 36px;
		cursor: pointer;

		align-self: center;
	}
	a.back-button svg {
		fill: var(--color-primary);
		width: 21px;
		height: 21px;
	}
	a.back-button.disableBackButton svg {
		fill: var(--color-primary-muted);
	}
	a.back-button.disableBackButton:hover {
		cursor: default;
	}
	nav.isHomePage {
		background: transparent;
		top: unset;
		bottom: 0;
	}
	.notifications-container {
		position: absolute;
		top: 50px;
		right: 10px;
	}
	.notifications-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25em;
		background-color: var(--home-gradient-color-1);
		border: none;
		height: 36px;
		width: 36px;
		cursor: pointer;
	}
	.notification-alert {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 10px;
		height: 10px;
		background-color: transparent;
		border-radius: 50%;
	}
	.notification-alert.hasNewNotifications {
		position: absolute;
		background-color: red;
	}
</style>
