<script>
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import Comments from './Components/Comments.svelte';
	import Issues from './Components/Issues.svelte';
	import Reviews from './Components/Reviews.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	export let selectedOption = 0;
	export let content;
	export let options = [];
	let ComponentOptions = [];

	// $: console.log('content::', content);

	// $: reactiveContent = content ?? {};

	// $: reactiveContent?.comments,
	// 	(() =>
	// 		(ComponentOptions = [
	// 			{
	// 				name: 'Comments',
	// 				props: {
	// 					gameId: reactiveContent?.id,
	// 					comments: reactiveContent?.comments,
	// 					parentCommentId: null
	// 				},
	// 				component: Comments
	// 			},
	// 			{
	// 				name: 'Issues',
	// 				component: Issues
	// 			},
	// 			{
	// 				name: 'Reviews',
	// 				component: Reviews
	// 			}
	// 		]))();

	// $: console.log('ComponentOptions::', ComponentOptions);

	$: Component = options[selectedOption].component;

	// const setOption = (i) => {
	// 	// option = i;
	// 	console.log('i::', i);
	// 	option = i;
	// };

	// let select;

	// $: console.log('select::', select);
</script>

<div class="widget-container">
	<div class="widget-controls">
		<!-- <select on:change={setOption(select?.value)} bind:this={select}>
			{#each ComponentOptions as avoption, i (avoption.name)}
				<option value={i}>{avoption.name}</option>
			{/each}
		</select> -->
		<!-- {#each ComponentOptions as avoption, i (avoption.name)}
			<div class="tab btn-{i}" class:active={option === i}>
				<Button
					action={() => setOption(i)}
					additionalClasses={'widget-button btn-{i} {avoption.name}'}
					label={avoption.name}
				/>
			</div>
		{/each} -->
	</div>

	<div class="component-container">
		<svelte:component this={Component} {...options[selectedOption].props} />
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
		padding: 0 20px 20px;
		overflow-y: scroll;
		height: 100%;
		max-height: calc(100% - 30px);
	}
	.component-container::-webkit-scrollbar {
		background: transparent;
		width: 10px;
	}

	.component-container::-webkit-scrollbar:hover {
		cursor: pointer;
	}

	/* Style the handle of the scrollbar */
	.component-container::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: 6px;
	}

	/* Handle on hover */
	.component-container::-webkit-scrollbar-thumb:hover {
		background: #555 !important;
		cursor: pointer;
	}
	.tab :global(button:hover) {
		background-color: transparent !important;
		color: var(--text-color-highlight) !important;
	}
</style>
