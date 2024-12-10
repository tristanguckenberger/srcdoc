<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
	// @ts-nocheck
	import { afterUpdate, tick } from 'svelte';

	export let currentSlide; // emblaApi?.selectedScrollSnap()
	export let scrollTo;
	export let selectedScrollSnap;
	export let index;

	afterUpdate(async () => {
		await tick();
	});
	const handleScrollTo = () => {
		// scrollTo(index);
	};
</script>

<div class="embla__dot" class:isSelected={currentSlide === index} on:click={handleScrollTo} />

<style>
	.embla__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--color-primary);
		margin-right: 8px;
	}
	.embla__dot.isSelected {
		background-color: var(--vibrant-blue);
	}
</style>
