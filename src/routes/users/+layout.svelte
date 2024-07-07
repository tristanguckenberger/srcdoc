<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import { themeKeyStore, themeDataStore } from '$lib/stores/themeStore';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { sideBarState } from '$lib/stores/layoutStore';

	let preferedThemeMode;
	$: isSideBarOpen = $fileSystemSidebarOpen || $sideBarState;

	const updateTheme = (e) => {
		// themeKeyStore.set(e.matches ? 'light' : 'dark');
		themeKeyStore.set('dark');
	};

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

<div id="editor-layout" class:sideBarOpen={$sideBarState}>
	<slot />
</div>

<style>
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: calc(100%);
		/* margin-left: 10px; */
		/* background-color: var(--color-secondary);
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
		border-radius: 8px; */
	}
	#editor-layout.sideBarOpen {
		width: calc(100% - 250px);
		margin-left: 10px;
	}
	#editor-layout {
		width: calc(100% - 20px);
		margin-left: 10px;
	}
</style>
