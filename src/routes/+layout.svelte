<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import {
		autoCompile,
		fileSystemSidebarOpen,
		triggerCompile,
		filesToUpdate,
		focusedFileId
	} from '$lib/stores/filesStore';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import {
		sideBarState,
		sideBarWidth,
		modalStateStore,
		modalOpenState
	} from '$lib/stores/layoutStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { browser } from '$app/environment';
	import Button from '$lib/ui/Button/index.svelte';
	import bgFadedMono13 from '$lib/assets/bgFadedMono13.svg';
	import bgFadedMono16 from '$lib/assets/bgFadedMono16.svg';
	import { enhance } from '$app/forms';
	import Modal from '$lib/ui/Modal/index.svelte';

	$: modalIsOpen = $modalOpenState;

	export let sessionData;
	export let data;

	let preferedThemeMode;

	const browseOptions = [{ option: 'Home' }, { option: 'Quick Play' }, { option: 'Favorites' }];

	$: currentBrowseOptionSelection = browseOptions[0];

	// controls file system sidebar toggle button visibility
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isProfilePage =
		splitPath[splitPath?.length - 1] === 'users' ||
		(splitPath[1] === 'games' && splitPath[splitPath?.length - 1] === 'main');
	$: isBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' || (splitPath[1] === 'users' && !isProfilePage);
	$: isUserGamesBrowsePage =
		splitPath[splitPath?.length - 1] === 'games' && splitPath[1] === 'users';
	$: isHomePage = $page?.route?.id === '/';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
	$: sessionData = data?.sessionData ?? $session;

	const updateTheme = (e) => {
		themeKeyStore.set(e.matches ? 'light' : 'dark');
	};

	// menu and sidebar toggle funcs
	let dropDownToggle = false;
	const toggleDropDown = () => {
		dropDownToggle = !dropDownToggle;
	};
	const toggleSideBar = () => {
		$sideBarState = !$sideBarState;
	};
	const toggleFileSystemSidebar = () => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen);

	// lifecycle funcs
	onMount(() => {
		if (browser) {
			preferedThemeMode = window?.matchMedia('(prefers-color-scheme: light)');
			preferedThemeMode?.addEventListener('change', updateTheme);
			updateTheme(preferedThemeMode);
		}
	});
	onDestroy(() => {
		preferedThemeMode?.removeListener(updateTheme);
	});
	const handleSave = async () => {
		// $: isFocused = file?.id.toString() === $focusedFileId.toString();

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
			console.log('updatedFile::', updatedFile);

			if (updatedFile?.ok) {
				$filesToUpdate = $filesToUpdate?.filter((file) => file.id !== fileId);
			}
		}
		// console.log('fileToUpdate::', fileToUpdate);
		// const updatedFile = await fetch(`/api/updateFile`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		fileId: fileToUpdate?.id,
		// 		gameId: file?.game_id ?? file?.gameId,
		// 		name: fileToUpdate?.name,
		// 		type: fileToUpdate?.type,
		// 		content: fileToUpdate?.content,
		// 		parentFileId: fileToUpdate?.parentFileId
		// 	})
		// });

		// console.log('updatedFile::', updatedFile);
	};
</script>

<div
	class="layout-container"
	class:isBrowsePage
	style="--svg-bg: url('{bgFadedMono16}'); --svg-dark-bg: url('{bgFadedMono13}'); height: 100%; width: 100%; {themeString}"
>
	<div
		class="bg-container"
		style="height: 100%; width: 100%;"
		class:isBrowsePage
		class:engineInRoute
		class:gameProfile={(isProfilePage || playInRoute) && !engineInRoute}
	>
		<nav
			class="top"
			class:matchGridWidth={!engineInRoute && isBrowsePage}
			class:isNotHomePage={!isHomePage}
			class:engineInRoute
			class:gameProfile={(isProfilePage || playInRoute) && !engineInRoute}
			class:showSideBar={$sideBarState}
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
				<ul class="profile-info">
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
						<a href="">
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
						<a href="">
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
						{#if !sessionData?.username && !$session?.username}
							<a href="/" class:active={isHomePage}>Sign In or Register</a>
						{/if}
					</ul>
				</div>
			</div>
			<main
				class:isProfilePage
				class:scrollable={!engineInRoute && !playInRoute && isBrowsePage}
				class:editor={(engineInRoute || playInRoute) && !isBrowsePage}
				class:showSideBar={$sideBarState}
				style={`${themeString}`}
			>
				<slot />
			</main>
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
		/* background-color: #fffcec; */
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
		/* background-color: var(--home-bg); */
	}
	:global(.main) {
		/* margin: 10px; */
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		max-width: calc(100%);
	}
	nav {
		color: var(--color-primary);
		padding: 10px;
		/* background-color: #fff9d7; */
		/* border-bottom: 2px solid #fff9d7; */
		position: fixed;
		top: 0;
		z-index: 10;
		width: calc(100% - 20px);
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 10px;
		align-items: center;
		/* justify-content: space-between; */
	}

	nav.matchGridWidth {
		justify-content: center;
		display: flex;
		/* background-color: var(--color-secondary); */
	}
	li.hiddenItem {
		display: none;
	}
	main.scrollable {
		/* overflow-y: scroll !important; */
	}
	main.editor {
		height: calc(100% - 66.5px) !important;
	}
	main.showSideBar {
		width: calc(100% - 230px);
		left: 230px;
		position: relative;
	}
	:global(.main.showSideBar) {
		width: calc(100% - 230px);
	}
	/* .home {
		justify-self: flex-end;
	} */
	ul.matchGridWidth {
		width: calc(var(--nav-width) - 20px);
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
	.isNotHomePage {
		/* background-color: var(--color-secondary); */
	}
	.isBrowsePage {
		/* overflow-y: scroll; */
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
		justify-content: flex-end;
		align-items: flex-start;
		padding: 0 10px;
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
		background-color: transparent !important;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555 !important;
		cursor: pointer !important;
	}
	.page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		overflow-x: hidden;
	}

	.page-container::-webkit-scrollbar {
		background: transparent;
		width: 10px;
	}

	.page-container::-webkit-scrollbar-track {
		background: var(--button-highlight);
	}

	.page-container::-webkit-scrollbar:hover {
		cursor: pointer;
	}

	.page-container::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: 6px;
	}

	.page-container::-webkit-scrollbar-thumb:hover {
		background: #555 !important;
		cursor: pointer;
	}

	.page-container.showSideBar {
	}
	.page-container.isGameProfile {
		overflow: hidden !important;
	}
	.page-container.engineInRoute {
	}

	/* .page-container {
		height: calc(100% - 66.5px);
	} */

	.sidebar {
		width: 230px;
		display: none;
		height: 100%;
		background-color: #1d1e20;

		flex-direction: column;
		position: fixed;
	}
	.sidebar.showSideBar {
		display: flex;
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
		border-radius: 4px;
		padding: 10px;
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
	.sidebar-section ul a,
	.sidebar-section ul .sidebar-action {
		color: var(--color-primary);
		text-decoration: none;
	}

	.sidebar-section ul a svg,
	.sidebar-section ul .sidebar-action svg {
		height: 1.6rem;
		width: 1.6rem;
		fill: var(--color-primary);
	}

	.sidebar-section ul a:hover,
	.sidebar-section ul .sidebar-action:hover {
		background-color: var(--button-highlight);
		color: var(--color-primary);
		cursor: pointer;
	}
	.sidebar-section ul a.active,
	.sidebar-section ul .sidebar-action.active {
		background-color: var(--button-highlight);
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
		left: 230px;
		z-index: 10;
		width: calc(100% - 250px);
	}
	.sidebar-toggle {
		position: absolute;
	}
	.sidebar-toggle.showSideBar {
		left: -220px;
	}

	#primary-actions {
		margin-block-start: 40px;
	}
</style>
