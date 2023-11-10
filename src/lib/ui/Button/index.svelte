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

	$: isIcon =
		label === 'open' ||
		label === 'close' ||
		label === 'play' ||
		label === 'pause' ||
		label === 'fav';
</script>

<div style={`${themeString}`}>
	{#if link}
		<a href={link} class:showSideBarToggle class:isIcon>
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
		<button
			on:click={action}
			class:showSideBarToggle
			class:follow={label === 'Follow'}
			class:isIcon
		>
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
			{:else if label === 'fav'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M178,28c-20.09,0-37.92,7.93-50,21.56C115.92,35.93,98.09,28,78,28A66.08,66.08,0,0,0,12,94c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,224.14,244,166.34,244,94A66.08,66.08,0,0,0,178,28Zm-5.49,142.36A328.69,328.69,0,0,1,128,202.16a328.69,328.69,0,0,1-44.51-31.8C61.82,151.77,36,123.42,36,94A42,42,0,0,1,78,52c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,61.4,160.2,52,178,52a42,42,0,0,1,42,42C220,123.42,194.18,151.77,172.51,170.36Z"
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
		color: var(--text-color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		/* height: 45px; */
		font-size: 1rem;
		background-color: transparent !important;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
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
		background-color: var(--button-highlight) !important;
		transition: background-color 250ms ease;
	}

	.isIcon {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
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
	button.follow {
		margin-right: 10px;
		transform: translateY(27px);
		background-color: #ffffff54 !important;
		color: var(--color-primary) !important;
	}
</style>
