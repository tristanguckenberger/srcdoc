<script>
	import { page } from '$app/stores';
	import { fileSystemSidebarOpen } from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import Button from '$lib/ui/Button/index.svelte';

	// controls file system sidebar toggle button visibility
	$: engineInRoute = $page?.route?.id?.split('/').some((path) => path === 'engine');
	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<nav class="top" style={`${themeString}`} class:hiddenItem={!engineInRoute}>
	<ul>
		<li class:hiddenItem={!engineInRoute}>
			<Button
				action={() => fileSystemSidebarOpen.set(!$fileSystemSidebarOpen)}
				label={$fileSystemSidebarOpen ? 'close' : 'open'}
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
		/* background-color: #333; */
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
	li.hiddenItem {
		display: none;
	}
	main.scrollable {
		overflow-y: scroll;
	}
	/* .home {
		justify-self: flex-end;
	} */
</style>
