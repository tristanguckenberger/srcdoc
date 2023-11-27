<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import { themeKeyStore, themeDataStore } from '$lib/stores/themeStore';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: isSideBarOpen = $fileSystemSidebarOpen;
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
		height: 100%;
		width: 100%;
		background-color: var(--color-secondary);
	}
	.modifiedWidth {
		max-width: calc(100% + 10px) !important;
		width: calc(100% + 10px) !important;
		position: absolute;
		left: -10px;
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
</style>
