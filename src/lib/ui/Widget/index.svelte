<script>
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import Comments from './Components/Comments.svelte';
	import Issues from './Components/Issues.svelte';
	import Reviews from './Components/Reviews.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	export let option = 0;
	export let content;

	const ComponentOptions = [
		{
			name: 'Comments',
			props: {
				gameId: content?.gameId,
				comments: content?.comments,
				parentCommentId: null
			},
			component: Comments
		},
		{
			name: 'Issues',
			component: Issues
		},
		{
			name: 'Reviews',
			component: Reviews
		}
	];

	$: Component = ComponentOptions[option].component;

	const setOption = (i) => {
		// option = i;
		console.log('i::', i);
		option = i;
	};
</script>

<div class="widget-container">
	<div class="widget-controls">
		{#each ComponentOptions as option, i}
			<Button action={() => setOption(i)} class="widget-button {option.name}" label={option.name} />
		{/each}
	</div>

	<h3>{ComponentOptions[option].name}</h3>
	<svelte:component this={Component} {...ComponentOptions[option].props} />
</div>

<style>
	.widget-container {
		background-color: var(--text-box);
		padding: 10px;
		border-radius: 4px;
		min-height: 75px;
	}
	.widget-controls {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 10px;
	}
	.widget-controls h3 {
		font-family: var(--header-font);
		color: var(--text-color-primary);
		margin-block-start: 0;
	}
	.widget-controls :global(button) {
		height: 36.5px;
		background-color: transparent !important;
	}
</style>
