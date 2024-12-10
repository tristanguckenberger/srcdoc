<script>
	import Logo from '$lib/ui/Logo/index.svelte';
	import { text } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} Props
	 * @property {string} [size] - 40: font=2.5, 60: font=3, 80: font=3.5, 100: font=4
	 */

	/** @type {Props} */
	let { size = 'm' } = $props();

	let fontSize = $state(3.5);
	let logoSize = $state(80);
	let textTop = $state(9);
	let textLeft = $state(-9);
	let letterSpacing = $state(-2);
	let outerRingPadding = $state(4);

	onMount(() => {
		switch (size) {
			case 'tiny':
				fontSize = 1;
				logoSize = 20;
				textTop = -7;
				textLeft = -1.9;
				letterSpacing = -0.5;
				outerRingPadding = 2;
				// logoTitleTop = 10;
				// logoTitleLeft = 20;
				break;
			case 'xs':
				fontSize = 2.5;
				logoSize = 40;
				textTop = 14;
				textLeft = -6.5;
				letterSpacing = -1;
				outerRingPadding = 4;
				break;
			case 's':
				fontSize = 3;
				logoSize = 60;
				textLeft = -6.4;
				textTop = 4;
				break;
			case 'm':
				fontSize = 3.5;
				logoSize = 80;
				textTop = 8;
				textLeft = -7.5;
				break;
			case 'l':
				fontSize = 4;
				logoSize = 100;
				textTop = 10;
				textLeft = -8.5;
				break;
			default:
				fontSize = 3.5;
				logoSize = 80;
				break;
		}
	});
</script>

<div class="logo-and-title">
	<div class="outer-logo-ring" style="--outerRingPadding: {outerRingPadding}px;">
		<Logo xDistance={logoSize} />
	</div>
	<h1
		class="logo-title"
		style="--fontSize: {fontSize}rem; --textTop: {textTop}px; --textLeft: {textLeft}px; --letterSpacing: {letterSpacing}px;"
	>
		PlayEngine
	</h1>
</div>

<style>
	.logo-and-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		top: 10px;
		left: 20px;
	}
	.logo-title {
		font-family: 'Source Sans 3', sans-serif;
		font-optical-sizing: auto;
		font-weight: 700;
		font-style: normal;
		font-size: var(--fontSize);
		color: var(--color-primary);
		margin-block-start: 1.5rem;
		letter-spacing: var(--letterSpacing);
		position: relative;
		left: var(--textLeft);
		top: var(--textTop);
		margin-block-start: 0;
	}
	:global(.logo-and-title .logo-container) {
		position: unset;
		top: unset;
		background-color: var(--color-primary);
		padding: var(--outerRingPadding) !important;
	}
	.outer-logo-ring {
		border-radius: 50%;
		background-color: var(--color-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--outerRingPadding);
		z-index: 10;
	}
</style>
