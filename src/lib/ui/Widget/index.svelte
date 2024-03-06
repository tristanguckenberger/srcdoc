<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import Comments from './Components/Comments.svelte';
	import Issues from './Components/Issues.svelte';
	import Reviews from './Components/Reviews.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';

	// export let selectedOption = 0;
	export let content;
	export let options = [];

	$: console.log('widget::options::', options);
	$: console.log('widget::selectedOption::', $selectedOption);

	$: Component = browser && options[$selectedOption]?.component;
</script>

<div class="widget-container">
	<div class="component-container">
		<svelte:component this={Component} {...options[$selectedOption]?.props} />
	</div>
</div>

<style>
	.widget-container {
		/* background-color: var(--text-box); */
		padding: 0;
		border-radius: 4px;
		min-height: 75px;
		padding-top: 10px;
		height: 100%;
		display: flex;
		justify-content: center;
	}
	.widget-controls {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		/* gap: 10px; */
	}
	.widget-controls h3 {
		font-family: var(--header-font);
		color: var(--text-color-primary);
		margin-block-start: 0;
	}
	.widget-controls :global(button) {
		height: 36.5px;
		background-color: transparent !important;
		font-family: 'Geologica' !important;
		font-weight: 200;
	}
	.tab {
		padding: 10px;
		position: relative;
		top: -10px;
		border-radius: 6px;
		border-top-right-radius: 8px;
		border-top-left-radius: 8px;
	}

	.tab :global(button) {
		color: #cdcdcdb4 !important;
	}
	.tab.active {
		/* border-bottom: 1px solid var(--text-color-highlight); */
		/* background-color: #202124; */
		/* color: var(--text-color-highlight); */
		/* background: -webkit-linear-gradient(270deg, #1e1f21 0%, #1a1b1d 40%); */
	}
	.tab.active :global(button) {
		color: var(--text-color-highlight) !important;
	}
	.component-container {
		overflow-y: scroll;
		overflow-x: hidden;
		height: 100%;
		max-height: calc(100% - 30px);
		width: 80%;
		padding: 0;
	}
	.component-container::-webkit-scrollbar {
		background: transparent;
		width: 10px;
		display: none;
	}

	.component-container::-webkit-scrollbar:hover {
		cursor: pointer;
		display: none;
	}

	/* Style the handle of the scrollbar */
	.component-container::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: 6px;
		display: none;
	}

	/* Handle on hover */
	.component-container::-webkit-scrollbar-thumb:hover {
		background: #555 !important;
		cursor: pointer;
		display: none;
	}
	.tab :global(button:hover) {
		background-color: transparent !important;
		color: var(--text-color-highlight) !important;
	}
	@media (max-width: 498px) {
		.component-container {
			/* width: calc(100% - 40px);
			padding: 0 20px 0 20px; */
			max-width: calc(100% - 20px);
		}
	}
	@media (min-width: 498px) {
		.component-container {
			/* width: calc(100% - 200px);
			padding: 0 100px 0 100px; */
			max-width: 1000px;
			/* display: flex;
    justify-content: center;
    align-items: center; */
		}
	}
</style>
