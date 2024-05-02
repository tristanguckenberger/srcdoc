<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import {
		fileSystemSidebarWidth,
		fileSystemSidebarOpen,
		openFiles
	} from '$lib/stores/filesStore.js';
	import { themeKeyStore, themeDataStore } from '$lib/stores/themeStore';
	import { sideBarState, sideBarWidth, appClientWidth } from '$lib/stores/layoutStore.js';
	import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { addPaddingToEditorStore } from '$lib/stores/editorStore';

	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: isSideBarOpen = $fileSystemSidebarOpen ?? $sideBarState;
	$: engineInRoute && sideBarState?.set(false);
	$: isMobile = $appClientWidth < 768;
	$: $openFiles?.length > 0
		? ($addPaddingToEditorStore = true)
		: ($addPaddingToEditorStore = false);

	let preferedThemeMode;
	let shouldAddPadding = false;

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

	afterUpdate(async () => {
		// await tick();
		$openFiles?.length > 0 ? ($addPaddingToEditorStore = true) : ($addPaddingToEditorStore = false);
		// await tick();
		shouldAddPadding = $addPaddingToEditorStore;
	});

	onDestroy(() => {
		preferedThemeMode?.removeListener(updateTheme);
		$addPaddingToEditorStore = false;
	});
</script>

<div
	id="editor-layout"
	class:isBrowsePage
	class:noSideBar={!engineInRoute}
	class:modifiedWidth={!isSideBarOpen && engineInRoute}
	class:isMobile
	class:showSideBar={$sideBarState}
	class:engineInRoute
	class:playInRoute
	class:addPaddingToEditorStore={shouldAddPadding}
	class:noOpenTabs={$openFiles?.length === 0}
	style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 15 : 0}px; {themeString}"
>
	{#if $openFiles?.length > 0}
		<div
			class="sidebar-container"
			class:modifiedTabBarWidth={!isSideBarOpen}
			class:isSideBarOpen
			class:hiddenContainer={!engineInRoute}
		>
			<div class="filler" class:sidebarIsNotOpen={!isSideBarOpen} />
			<TabContainer />
		</div>
	{/if}
	<slot />
</div>

<style>
	:global(body > div) {
		/* display: flex; */
		/* flex-direction: column; */
		margin: 0;
		padding: 0;
	}
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: calc(100% + 10px);
		width: 100%;
		background-color: var(--color-secondary);
		background: var(--home-gradient-color-2);
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
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
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
		width: calc(100% - 230px);
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
</style>
