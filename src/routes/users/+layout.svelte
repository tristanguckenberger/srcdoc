<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import {
		themeKeyStore,
		themeDataStore,
		actionListHoverStore,
		tweenedHex
	} from '$lib/stores/themeStore';
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { sideBarState } from '$lib/stores/layoutStore';

	let preferedThemeMode;
	$: isSideBarOpen = $fileSystemSidebarOpen || $sideBarState;

	const updateTheme = (e) => {
		// themeKeyStore.set(e.matches ? 'light' : 'dark');
		themeKeyStore.set('dark');
	};

	let color = '#43484cb3';
	const tweenedColor = tweenedHex(color, {
		duration: 1000
	});

	onMount(() => {
		if (browser) {
			preferedThemeMode = window?.matchMedia('(prefers-color-scheme: light)');
			preferedThemeMode.addEventListener('change', updateTheme);
			updateTheme(preferedThemeMode);
		}
	});

	onDestroy(() => {
		preferedThemeMode?.removeListener(updateTheme);
	});

	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div
	id="editor-layout"
	class:sideBarOpen={$sideBarState}
	style="{themeString} --theme-or-highlight: {$tweenedColor};"
>
	<slot />
</div>

<style>
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: calc(100% + 10px);
		width: calc(100% - 20px);
		margin-left: 10px;
		background-color: var(--color-secondary);
		/* background: var(--home-gradient-color-2);
		background: linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -moz-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -webkit-linear-gradient(
			270deg,
			var(--theme-or-highlight) 0%,
			var(--home-gradient-color-2) 100%
		);
		border-radius: 8px;
		transition: background 0.09s linear(0.07 -1.12%, 1 100%); */
	}
	#editor-layout.sideBarOpen {
		width: calc(100% - 250px);
		margin-left: 10px;
	}
	@media (min-width: 498px) {
		#editor-layout {
			height: unset;
		}
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
		width: calc(var(--sidebar-width) + 10px);
		height: 30px;
	}
	.filler.sidebarIsNotOpen {
		width: 0;
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
		width: calc(100% - 250px);
	}

	@media (max-width: 498px) {
		#editor-layout :global(.main),
		#editor-layout :global(.main.grid) {
			width: 100%;
		}
		#editor-layout :global(.main) {
			width: 100% !important;
			height: 100% !important;
			margin: 0 !important;
		}
	}
	#editor-layout.engineInRoute :global(.main) {
		width: calc(100% - 20px) !important;
	}

	@media (min-width: 498px) {
		#editor-layout :global(.main),
		#editor-layout :global(.main.grid) {
			width: calc(100% - 20px) !important;
		}
		#editor-layout.playInRoute :global(.main),
		#editor-layout.playInRoute :global(.main.grid) {
			width: calc(100% - 20px) !important;
		}
	}
	#editor-layout.engineInRoute.noOpenTabs :global(div.main) {
		max-height: unset !important;
		height: 100% !important;
		margin-top: 0 !important;
	}
	#editor-layout.engineInRoute.addPaddingToEditorStore {
		height: calc(100%) !important;
		padding-top: 20px !important;
		max-height: calc(100%) !important;
	}
	#editor-layout.playInRoute,
	#editor-layout.engineInRoute {
		background: unset;
	}

	#editor-layout.playInRoute {
		height: 100%;
	}

	#editor-layout.showSideBar {
		width: calc(100% - 250px);
		margin-left: 10px;
	}

	#editor-layout.playInRoute,
	#editor-layout.engineInRoute {
		width: calc(100%);
		margin-left: 0;
	}

	#editor-layout.playInRoute.showSideBar,
	#editor-layout.engineInRoute.showSideBar {
		width: calc(100% - 230px);
		margin-left: 0;
	}
	#editor-layout.isGamesPage {
		margin-bottom: 10px;
	}
</style>
