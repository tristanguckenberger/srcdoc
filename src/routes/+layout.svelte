<script>
	import { page } from '$app/stores';
	import { fileSystemSidebarOpen } from '$lib/stores/filesStore';

	// controls file system sidebar toggle button visibility
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
</script>

<nav class="top">
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

<main class:scrollable={!engineInRoute}>
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
	}
	:global(.main) {
		margin: 10px;
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		max-width: calc(100%);
		max-height: calc(100vh - 76px);
	}
	nav {
		background-color: #333;
		color: #fff;
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
		color: #fff;
		text-decoration: none;
	}
	.hiddenItem {
		display: none;
	}

	main.scrollable {
		overflow-y: scroll;
	}
</style>
