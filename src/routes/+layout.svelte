<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { autoCompile, fileSystemSidebarOpen, triggerCompile } from '$lib/stores/filesStore';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import { onMount, onDestroy } from 'svelte';
	import { session } from '$lib/stores/sessionStore.js';
	import { browser } from '$app/environment';
	import Button from '$lib/ui/Button/index.svelte';
	import bgFadedMono10 from '$lib/assets/bgFadedMono10.svg';

	export let sessionData;
	export let data;

	let preferedThemeMode;

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

	let dropDownToggle = false;

	const toggleDropDown = () => {
		dropDownToggle = !dropDownToggle;
	};
</script>

<div class:isBrowsePage style="--svg-bg: url('{bgFadedMono10}'); height: 100%; width: 100%;">
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
					{#if sessionData?.username || $session?.username}
						<li>
							<Button
								link="/users/{sessionData?.id}"
								userName={sessionData?.username ?? $session?.username}
								isRounded
								action={toggleDropDown}
								showDropDown={dropDownToggle}
							/>
						</li>
					{/if}
					<div class="more" class:dropDownToggle class:isBrowsePage>
						<ul>
							<li>
								<form class="logout-form" action="/?/logout" method="POST">
									<Button class="logout" label="Logout" />
								</form>
							</li>
						</ul>
					</div>
				</ul>
			</ul>
		</nav>

		<main
			class:isProfilePage
			class:scrollable={!engineInRoute && !playInRoute && isBrowsePage}
			class:editor={(engineInRoute || playInRoute) && !isBrowsePage}
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
		overflow-y: scroll !important;
	}
	main.editor {
		height: calc(100% - 66.5px) !important;
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
	.isBrowsePage {
		overflow-y: scroll;
	}
	.isProfilePage {
		height: 100%;
		overflow-y: scroll;
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
		top: 47px;
		right: 10px;
		z-index: 100;
		border-radius: 12px;
		border-top-right-radius: 0px;
		opacity: 1;
	}
	.more.isBrowsePage {
		right: 20px;
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
</style>
