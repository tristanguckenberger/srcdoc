<script>
	// @ts-nocheck
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { fileSystemSidebarWidth, fileSystemSidebarOpen } from '$lib/stores/filesStore.js';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
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
</script>

<div
	id="editor-layout"
	class:modifiedWidth={!isSideBarOpen}
	style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 15 : 0}px;"
>
	<div class="sidebar-container" class:modifiedTabBarWidth={!isSideBarOpen} class:isSideBarOpen>
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
		background-color: #333;
	}
	#editor-layout {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.modifiedWidth {
		max-width: calc(100% + 10px) !important;
		width: calc(100% + 10px) !important;
		position: absolute;
		left: -10px;
	}
	.sidebar-container {
		/* display: flex;
		flex-direction: row;
		height: 30px; */
		/* width: calc(100% - (var(--sidebar-width) + 10px)); */
		display: flex;
	}
	.modifiedTabBarWidth {
		padding-left: 20px;
	}
	.filler {
		width: var(--sidebar-width);
		height: 30px;
	}

	/* :global(.section-panel) {
		border-radius: 6px;
		border: 2px solid #5c5c5c;
	} */
</style>
