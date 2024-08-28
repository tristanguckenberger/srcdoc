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
	$: verifyInRoute = $page?.route?.id?.split('/').some((path) => path === 'verify');
	$: libraryInRoute = $page?.route?.id?.split('/').some((path) => path === 'library');
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: userProfilePageInRoute = splitPath[splitPath?.length - 1] === '[slug]' && splitPath[splitPath?.length - 2] === 'users';
	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<div
	id="editor-layout"
	class:verifyInRoute
	class:libraryInRoute
	class:userProfilePageInRoute
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
	:global(.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main) {
		height: 100% !important;
		margin: 0 !important;
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
		#editor-layout.libraryInRoute {
    		height: calc(100% + -20px);
    		margin-left: 10px;
		}
		#editor-layout.userProfilePageInRoute {
			height: calc(100% - 30px);
			margin-left: 10px;
			margin-top: 10px;
		}
	}

	@media (min-width: 498px) {
		#editor-layout :global(.main),
		#editor-layout :global(.main.grid) {
			width: calc(100% - 20px) !important;
		}
	}
</style>
