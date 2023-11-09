<script>
	// @ts-nocheck
	import { triggerCompile } from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';

	export let label;
	export let link;
	export let action;

	$: themeString = $themeDataStore?.theme?.join(' ');
	let close = '<-';

	// $: showPlayButton = $triggerCompile ?? null;

	$: showSideBarToggle = label === 'open' || label === 'close';
</script>

<div style={`${themeString}`}>
	{#if link}
		<a href={link} class:showSideBarToggle>
			{#if label === 'open'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="#000000"
					><path
						d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z"
					/></svg
				>
			{:else if label === 'close'}
				{close}
			{:else}
				{label}
			{/if}
		</a>
	{:else}
		<button on:click={action} class:showSideBarToggle>
			{#if label === 'open'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36ZM44,60H76V196H44ZM212,196H100V60H212Z"
					/></svg
				>
			{:else if label === 'close'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
					/></svg
				>
			{:else if label === 'play'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z"
					/></svg
				>
			{:else if label === 'pause'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"
					/></svg
				>
			{:else}
				{label}
			{/if}
		</button>
	{/if}
</div>

<style>
	a,
	button {
		padding-block: 0;
		color: var(--folder-button-color) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		/* height: 45px; */
		font-size: 1rem;
		background-color: var(--color-highlight-faded) !important;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
	}
	svg {
		width: 1rem;
		height: 1rem;
		fill: var(--folder-button-color);
	}
	a:hover,
	button:hover {
		color: var(--text-color-highlight);
		cursor: pointer;
	}

	button.showSideBarToggle {
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
	}

	a.showSideBarToggle {
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
	}
</style>
