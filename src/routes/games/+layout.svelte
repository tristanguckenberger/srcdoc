<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import { themeKeyStore, themeDataStore } from '$lib/stores/themeStore';
	import { sideBarState, sideBarWidth, appClientWidth } from '$lib/stores/layoutStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: isSideBarOpen = $fileSystemSidebarOpen ?? $sideBarState;
	$: engineInRoute && sideBarState?.set(false);
	$: isMobile = $appClientWidth < 768;
	let preferedThemeMode;

	const updateTheme = (e) => {
		themeKeyStore?.set(e.matches ? 'light' : 'dark');
	};

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
</script>

<div
	id="editor-layout"
	class:isBrowsePage
	class:noSideBar={!engineInRoute}
	class:modifiedWidth={!isSideBarOpen}
	class:isMobile
	class:showSideBar={$sideBarState}
	class:engineInRoute
	class:playInRoute
	style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 15 : 0}px; {themeString}"
>
	<div
		class="sidebar-container"
		class:modifiedTabBarWidth={!isSideBarOpen}
		class:isSideBarOpen
		class:hiddenContainer={!engineInRoute}
	>
		<div class="filler" />
		<TabContainer />
	</div>
	<slot />
</div>

<style>
	:global(body > div) {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: calc(100% + 10px);
		width: 100%;
		/* background-color: var(--color-secondary); */
		background-color: var(--darker-bg);
	}
	.modifiedWidth {
		max-width: calc(100% + 10px) !important;
		width: calc(100% + 10px) !important;
		position: absolute;
		left: -10px;
	}
	.engineInRoute.isMobile {
		top: 56.5px;
		position: absolute;
		height: calc(100% - 56.5px) !important;
	}
	.engineInRoute.isMobile.modifiedWidth {
		top: 56.5px;
		position: absolute;
		height: calc(101%) !important;
	}
	.sidebar-container {
		display: flex;
	}
	.modifiedTabBarWidth {
		padding-left: 20px;
	}
	.filler {
		width: calc(var(--sidebar-width) + 20px);
		height: 30px;
	}
	:global(.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main) {
		height: 100% !important;
		margin: 0 !important;
	}
	.noSideBar {
		align-items: center;
	}
	.hiddenContainer {
		display: none;
	}
	#editor-layout.showSideBar {
		width: calc(100% - 230px);
	}
	#editor-layout :global(.main),
	#editor-layout :global(.main.grid) {
		width: calc(100% - 100px);
	}
	@media (max-width: 498px) {
		#editor-layout :global(.main),
		#editor-layout :global(.main.grid) {
			width: 100%;
		}
	}
	#editor-layout.engineInRoute :global(.main) {
		width: calc(100% - 20px) !important;
	}
	#editor-layout.playInRoute :global(.main),
	#editor-layout.playInRoute :global(.main.grid) {
		width: calc(100% - 20px);
	}
</style>
