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

	$: Component = browser && options[$selectedOption]?.component;
</script>

<div class="widget-container">
	<div class="component-container">
		<svelte:component this={Component} {...options[$selectedOption]?.props} />
	</div>
</div>

<style>
	.widget-container {
		padding: 0;
		border-radius: 4px;
		min-height: 75px;
		padding-top: 10px;
		height: 100%;
		display: flex;
		justify-content: center;
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
	.component-container::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: 6px;
		display: none;
	}

	.component-container::-webkit-scrollbar-thumb:hover {
		background: #555 !important;
		cursor: pointer;
		display: none;
	}
	@media (max-width: 498px) {
		.component-container {
			max-width: calc(100% - 20px);
		}
	}
	@media (min-width: 498px) {
		.component-container {
			max-width: 1000px;
		}
	}
</style>
