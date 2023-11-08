<script>
	import { page } from '$app/stores';
	import { fileSystemSidebarOpen } from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';

	// controls file system sidebar toggle button visibility
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<nav class="top" style={`${themeString}`}>
	<ul>
		<li class:hiddenItem={!engineInRoute}>
			<button on:click={() => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen)}
				>{$fileSystemSidebarOpen ? 'close' : 'open'}</button
			>
		</li>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
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
		/* background-color: #333; */
		background-color: var(--color-secondary);
		color: var(--color-primary);
		padding: 1rem;
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	nav ul li {
		margin-right: 1rem;
	}

	nav ul li a {
		color: var(--color-primary);
		text-decoration: none;
	}
	.hiddenItem {
		display: none;
	}

	main.scrollable {
		overflow-y: scroll;
	}
</style>
