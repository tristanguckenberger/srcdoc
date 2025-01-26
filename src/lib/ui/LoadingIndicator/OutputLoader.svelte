<script>
	import { fade } from 'svelte/transition';

	let { hide } = $props();
</script>

<div class="loader" class:hide></div>

<style>
	.loader {
		display: inline-flex;
		gap: 5px;
		position: relative;
		top: calc(50% - 25px / 2);
		left: calc(50% - 55px / 2);
		z-index: 1;
	}
	.loader.hide {
		display: none;
	}
	.loader:before,
	.loader:after {
		content: '';
		width: 25px;
		aspect-ratio: 1;
		box-shadow: 0 0 0 3px inset #fff;
		border-radius: 2px;
		animation: l4 1.5s infinite;
	}
	.loader:after {
		--s: -1;
		animation-delay: 0.75s;
	}
	@keyframes l4 {
		0% {
			transform: scaleX(var(--s, 1)) translate(0) rotate(0);
		}
		16.67% {
			transform: scaleX(var(--s, 1)) translate(-50%) rotate(0);
		}
		33.33% {
			transform: scaleX(var(--s, 1)) translate(-50%) rotate(90deg);
		}
		50%,
		100% {
			transform: scaleX(var(--s, 1)) translate(0) rotate(90deg);
		}
	}
</style>
