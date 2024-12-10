<script>
	import { run, preventDefault } from 'svelte/legacy';

	// @ts-nocheck
	// original creator credit: https://svelte.dev/repl/d65a4e9f0ae74d1eb1b08d13e428af32?version=3.35.0
	// based on suggestions from:
	// Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
	// On Designing and Building Toggle Switches by Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
	

	/**
	 * @typedef {Object} Props
	 * @property {any} label - and this example by Scott O'hara https://codepen.io/scottohara/pen/zLZwNv
	 * @property {string} [design]
	 * @property {any} [options]
	 * @property {number} [fontSize]
	 * @property {boolean} [value]
	 */

	/** @type {Props} */
	let {
		label,
		design = 'inner label',
		options = [],
		fontSize = 16,
		value = $bindable(false)
	} = $props();

	let checked;
	run(() => {
		checked = value;
	});

	const uniqueID = Math.floor(Math.random() * 100);

	function handleClick(event) {
		const target = event.target;

		const state = target.getAttribute('aria-checked');

		checked = state === 'true' ? false : true;

		value = checked;
	}
</script>

<div
	class="s s--slider"
	class:publishedToggle={label === 'Published' || label === 'Public'}
	style="font-size:{fontSize}px"
>
	{#if label === 'Published'}
		<span class="input-label toggle-switch">Published</span>
	{:else if label === 'Public'}
		<span class="input-label toggle-switch">Make it public?</span>
	{:else}
		<span id={`switch-${uniqueID}`}>{label}</span>
	{/if}
	<button
		role="switch"
		aria-checked={checked}
		aria-labelledby={`switch-${uniqueID}`}
		onclick={preventDefault(handleClick)}
	></button>
</div>

<style>
	:root {
		--accent-color: CornflowerBlue;
		--gray: #ccc;
	}
	/* Inner Design Option */

	/* Slider Design Option */

	.s--slider {
		display: flex;
		align-items: center;
	}

	.s--slider button {
		width: 3em;
		height: 1.6em;
		position: relative;
		margin: 0 0 0 1em;
		background: var(--gray);
		border: none;
	}
	.s--slider button:hover {
		background: var(--gray);
	}

	.s--slider button::before {
		content: '';
		position: absolute;
		width: 1.3em;
		height: 1.3em;
		background: #fff;
		top: 0.13em;
		right: 1.5em;
		transition: transform 0.3s;
	}

	.s--slider button[aria-checked='true'] {
		background-color: var(--accent-color);
	}

	.s--slider button[aria-checked='true']:hover {
		background-color: var(--accent-color);
	}

	.s--slider button[aria-checked='true']::before {
		transform: translateX(1.3em);
		transition: transform 0.3s;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 0px 1px var(--accent-color);
	}

	/* Slider Design Option */
	.s--slider button {
		border-radius: 1.5em;
	}

	.s--slider button::before {
		border-radius: 100%;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 8px var(--accent-color);
		border-radius: 1.5em;
	}
	span.input-label.toggle-switch {
		font-weight: 500;
		font-size: 1rem;
		font-family: var(--header-font), sans-serif;
		color: var(--color-primary);
	}
	.s.s--slider:hover > * {
		cursor: pointer;
	}
</style>
