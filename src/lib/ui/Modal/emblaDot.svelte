<script>
	// @ts-nocheck
	import { afterUpdate, tick } from 'svelte';

	export let currentSlide; // emblaApi?.selectedScrollSnap()
	export let scrollTo;
	export let selectedScrollSnap;
	export let index;

	//

	$: async () => console.log(await selectedScrollSnap?.())();

	afterUpdate(async () => {
		await tick();
		console.log(await selectedScrollSnap?.());
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
