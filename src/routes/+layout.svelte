<script>
	import { page } from '$app/stores';
	import { autoCompile, fileSystemSidebarOpen, triggerCompile } from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';

	// controls file system sidebar toggle button visibility
	$: splitPath = $page?.route?.id?.split('/') ?? [];
	$: engineInRoute = splitPath.some((path) => path === 'engine');
	$: isBrowsePage = splitPath[splitPath?.length - 1] === 'games';
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: playPauseLabel = $triggerCompile ? 'pause' : 'play';
</script>

<nav class="top" style={`${themeString}`} class:matchGridWidth={!engineInRoute && isBrowsePage}>
	<ul class:matchGridWidth={!engineInRoute && isBrowsePage}>
		<li class:hiddenItem={!engineInRoute}>
			<Button
				action={() => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen)}
				label={$fileSystemSidebarOpen ? 'close' : 'open'}
				link={null}
			/>
		</li>
		<li class:hiddenItem={!engineInRoute && !$autoCompile}>
			<Button
				action={() => triggerCompile.set(!$triggerCompile)}
				label={playPauseLabel}
				link={null}
			/>
		</li>
		<li class="home"><Button link="/" action={null} label={'Home'} /></li>
		<li class="browse"><Button link="/games" action={null} label={'Browse'} /></li>
	</ul>
</nav>

<main class:scrollable={!engineInRoute} style={`${themeString}`}>
	<slot />
</main>

<style>
	:global(body > div) {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		max-width: 100%;
		background-color: var(--color-secondary);
	}
	:global(.main) {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		max-width: calc(100%);
		max-height: calc(100vh - 76px);
	}
	nav {
		background-color: var(--color-secondary);
		color: var(--color-primary);
		padding: 10px;
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
</style>
