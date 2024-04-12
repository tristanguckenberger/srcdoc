<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { itemsInStack } from '$lib/stores/modalStackStore';
</script>

<div class="indicator-container">
	<svg width="120" height="120" viewBox="0 0 120 120">
		<circle cx="50" cy="50" r="40" stroke="black" stroke-width="12" fill="transparent" />
		<circle
			cx="50"
			cy="50"
			r="40"
			stroke="red"
			stroke-width="12"
			fill="transparent"
			stroke-dasharray="314"
			class="timer-animation"
		/>
	</svg>
</div>

<style>
	@keyframes drawCircle {
		0% {
			stroke-dashoffset: 314; /* Assuming the circle's circumference is 314 */
			stroke: green;
		}
		40% {
			stroke: green;
		}
		50% {
			stroke: yellow;
		}
		75% {
			stroke: red;
		}
		100% {
			stroke-dashoffset: 0;
			stroke: red;
		}
	}

	.timer-animation {
		animation: drawCircle 5s linear forwards;
	}

	.indicator-container {
		position: absolute;
		top: 3px;
		right: 3px;
	}

	.indicator-container svg {
		transform: rotate(-90deg);
		width: 32px;
		height: 32px;
	}

	.indicator-container svg circle {
		stroke: var(--search-result-card);
	}
</style>
