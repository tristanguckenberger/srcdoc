<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { autoCompile, fileSystemSidebarOpen, triggerCompile } from '$lib/stores/filesStore';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import { session } from '$lib/stores/sessionStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Button from '$lib/ui/Button/index.svelte';
	import Frame from '$lib/assets/Frame.svg';
	import bgFaded from '$lib/assets/bgFaded.svg';
	import bgFadedMono from '$lib/assets/bgFadedMono.svg';
	import bgFadedMono10 from '$lib/assets/bgFadedMono10.svg';

	export let sessionData;

	let preferedThemeMode;

	// controls file system sidebar toggle button visibility
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: playInRoute = splitPath.some((path) => path === 'play');
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
	$: isHomePage = $page?.route?.id === '/';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
	$: $session = sessionData ?? $session;

	const updateTheme = (e) => {
		themeKeyStore.set(e.matches ? 'light' : 'dark');
	};

	let shouldPoll = false;

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

<div style="--svg-bg: url('{bgFadedMono10}'); height: 100%; width: 100%;">
	<div class="bg-container" style="height: 100%; width: 100%;">
		<nav
			class="top"
			style={`${themeString}`}
			class:matchGridWidth={!engineInRoute && isBrowsePage}
			class:isNotHomePage={!isHomePage}
		>
			<ul class:matchGridWidth={!engineInRoute && isBrowsePage}>
				<ul>
					{#if engineInRoute}
						<li class:hiddenItem={!engineInRoute}>
							<Button
								action={() => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen)}
								label={$fileSystemSidebarOpen ? 'close' : 'open'}
								link={null}
							/>
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
					<li class="home" style="height: calc(100% - 20px) !important;">
						<Button link="/" action={null} label={'Home'} />
					</li>
					<li class="browse" style="height: calc(100% - 20px) !important;">
						<Button link="/games" action={null} label={'Browse'} />
					</li>
				</ul>
				<ul class="profile-info">
					{#if $session?.username}
						<li>
							<Button link="/users/{1}" action={null} userName={$session?.username} isRounded />
						</li>
					{/if}
				</ul>
			</ul>
		</nav>

		<main
			class:scrollable={!engineInRoute && !playInRoute && isBrowsePage}
			style={`${themeString}`}
		>
			<slot />
		</main>
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
		background-size: 50%;
	}
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		max-width: 100%;
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
		background-color: var(--color-secondary);
	}
	li.hiddenItem {
		display: none;
	}
	main.scrollable {
		overflow-y: scroll;
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
		background-color: var(--color-secondary);
	}
</style>
