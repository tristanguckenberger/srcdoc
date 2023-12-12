<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import { themeKeyStore, themeDataStore } from '$lib/stores/themeStore';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let preferedThemeMode;
	$: isSideBarOpen = $fileSystemSidebarOpen;

	const updateTheme = (e) => {
		themeKeyStore.set(e.matches ? 'light' : 'dark');
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

<div id="editor-layout">
	<slot />
</div>

<style>
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		/* background-color: var(--color-secondary); */
		background-color: var(--darker-bg);
	}
</style>
