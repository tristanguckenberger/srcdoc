<script>
	// @ts-nocheck
	import { spring } from 'svelte/motion';
	import { onDestroy, onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	/**
	 * @typedef {Object} Props
	 * @property {number} [xDistance]
	 */

	/** @type {Props} */
	let { xDistance = $bindable(0) } = $props();

	let initialized = $state(false);

	let dot1Height = $state();
	let dot2Height = $state();
	let dot3Height = $state();

	const dot1 = spring(
		{ top: randomPercentage('dot1'), left: randomPercentage('dot1') },
		{ stiffness: 0.007, damping: 0.95, precision: 0.007 }
	);
	const dot2 = spring(
		{ top: randomPercentage('dot2'), left: randomPercentage('dot2') },
		{ stiffness: 0.007, damping: 0.95, precision: 0.007 }
	);
	const dot3 = spring(
		{ top: randomPercentage('dot3'), left: randomPercentage('dot3') },
		{ stiffness: 0.007, damping: 0.95, precision: 0.007 }
	);

	function randomPercentage(dot) {
		const min = 0;
		const max = 100;
		const ranPer = Math.floor(Math.random() * (max - min + 1)) + min;

		switch (dot) {
			case 'dot1':
				if (ranPer + dot1Height > 100) {
					return ranPer - 45;
				}
				return ranPer;
			case 'dot2':
				if (ranPer + dot2Height > 100) {
					return ranPer - 60;
				}
				return ranPer;
			case 'dot3':
				if (ranPer + dot3Height > 100) {
					return ranPer - 45;
				}
				return ranPer;
			default:
				return ranPer;
		}
	}

	function updatePositions() {
		dot1.set({ top: randomPercentage('dot1'), left: randomPercentage('dot1') }, { soft: 0.08 });
		dot2.set({ top: randomPercentage('dot2'), left: randomPercentage('dot2') }, { soft: 0.08 });
		dot3.set({ top: randomPercentage('dot3'), left: randomPercentage('dot3') }, { soft: 0.08 });
	}

	onMount(() => {
		updatePositions();
		setInterval(updatePositions, 3000);
		initialized = true;
	});

	onDestroy(() => {
		initialized = false;
		xDistance = 0;
	});

	let calcDistance = $derived(xDistance ? xDistance / 3 : 80 / 3);
</script>

{#if xDistance || (xDistance >= 0 && initialized)}
	<div
		class="logo-container"
		role="button"
		tabindex="0"
		style="left: calc(-{xDistance}px + {xDistance ? 20 : 0}px);"
		onclick={() => goto('/games')}
		onkeypress={(e) => e.key === 'Enter'}
		aria-label="Platform Blob Logo: Click this to navigate to the games page."
	>
		<div
			class="logo-outer"
			style="width: {xDistance ? xDistance : 80}px; height: {xDistance
				? xDistance
				: 80}px; --calcDistance: {calcDistance}px;"
		>
			<div>
				<div class="logo-blur-container"></div>
				<div
					class="dot color1"
					style="top: {$dot1.top}%; left: {$dot1.left}%;"
					bind:clientHeight={dot1Height}
				></div>
				<div
					class="dot color2"
					style="top: {$dot2.top}%; left: {$dot2.left}%;"
					bind:clientHeight={dot2Height}
				></div>
				<div
					class="dot color3"
					style="top: {$dot3.top}%; left: {$dot3.left}%;"
					bind:clientHeight={dot3Height}
				></div>
			</div>
		</div>
	</div>
{/if}

<style>
	.logo-container {
		position: absolute;
		left: 20px;
		top: 20px;
		background: #2e324c;
		border-radius: 50%;
		padding: 5px;
	}
	.logo-container:hover {
		cursor: pointer;
	}

	.logo-outer {
		width: 10rem;
		height: 10rem;
		background-color: #232c6914;
		border-radius: 500px;
		overflow: hidden;
		position: relative;
	}

	.logo-blur-container {
		position: absolute;
		filter: saturate(180%) blur(20%);
		z-index: 10;
		width: 100%;
		height: 100%;
	}

	.dot {
		width: 45%;
		height: 45%;
		border-radius: 50%;
		position: absolute;
		filter: saturate(4) blur(var(--calcDistance));
	}

	.color1 {
		background-color: #d73ce5;
	}

	.color2 {
		background-color: #145ce6;
		width: 60%;
		height: 60%;
	}

	.color3 {
		background-color: #440c66;
	}
</style>
