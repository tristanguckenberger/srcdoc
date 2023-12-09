<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { autoCompile, fileSystemSidebarOpen, triggerCompile } from '$lib/stores/filesStore';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import { sideBarState, sideBarWidth } from '$lib/stores/layoutStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { browser } from '$app/environment';
	import Button from '$lib/ui/Button/index.svelte';
	import bgFadedMono13 from '$lib/assets/bgFadedMono13.svg';
	import bgFadedMono16 from '$lib/assets/bgFadedMono16.svg';

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
		splitPath.some((path) => path === 'users') ||
		(splitPath.some((path) => path === 'games') && splitPath.some((path) => path === 'main'));
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
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

	$: console.log('session::', $session, sessionData);
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
						<li>
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

		<div class="page-container" class:engineInRoute>
			<div
				class="sidebar"
				class:engineInRoute
				class:showSideBar={$sideBarState}
				bind:clientWidth={$sideBarWidth}
			>
				<div class="sidebar-section">
					<ul>
						<a href="/games" class:active={isBrowsePage}> Home </a>
						<a href="">Quick Play</a>
						<a href="">Favorites</a>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<h3>Explore</h3>
					<ul>
						<a href="/trending">Trending</a>
						<a href="/top?rated">Top Rated</a>
						<a href="/top?played">Top Played</a>
						<a href="/new">Recently Added</a>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<ul>
						<a href="">My Projects</a>
						<a href="">Create New Project</a>
					</ul>
				</div>
				<hr class="sidebar-divider" />
				<div class="sidebar-section">
					<ul>
						<a href="/settings">Settings</a>
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
		overflow-y: scroll;
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
	.avatar {
		border-radius: 50%;
		width: 36.5px;
		height: 36.5px;
		object-fit: cover;
	}
	.isNotHomePage {
		/* background-color: var(--color-secondary); */
	}
	.isBrowsePage {
		/* overflow-y: scroll; */
	}
	.isProfilePage {
		height: 100%;
		/* overflow-y: scroll; */
		background-color: var(--color-secondary);
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
		background-color: aliceblue;
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
		background-color: #202124;
	}
	.bg-container.engineInRoute {
		background-color: #202124 !important;
	}
	.bg-container.gameProfile {
		background-color: #202124 !important;
	}
	nav.engineInRoute {
		background-color: #202124 !important;
	}
	nav.gameProfile {
		background-color: #202124 !important;
	}

	/* SCROLL BAR */
	/* Style the scrollbar itself (width, color, etc.) */
	::-webkit-scrollbar {
		/* width: 10px; */
		/* z-index: 10000;
		position: absolute; */
	}

	/* Style the track of the scrollbar */
	::-webkit-scrollbar-track {
		background: var(--color-secondary);
	}

	/* Style the handle of the scrollbar */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	.page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}
	.page-container.engineInRoute {
	}

	.sidebar {
		width: 230px;
		display: none;
		height: 100%;
		background-color: var(--color-secondary);
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
	}
	.sidebar-section ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		list-style: none;
		padding-inline-start: 10px;
	}
	.sidebar-section ul a {
		display: flex;
		flex-direction: row;
		gap: 10px;
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
	.sidebar-section ul a {
		color: var(--color-primary);
		text-decoration: none;
	}

	.sidebar-section ul a:hover {
		background-color: var(--button-highlight);
		color: var(--color-primary);
		cursor: pointer;
	}
	.sidebar-section ul a.active {
		background-color: var(--button-highlight);
		color: var(--color-primary);
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
</style>
