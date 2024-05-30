<script>
	// @ts-nocheck

	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import EmblaDot from './emblaDot.svelte';
	import {
		homePageInfoStore,
		modalFullInfoStore,
		gamePageInfoStore,
		editorPageInfoStore
	} from '$lib/stores/InfoStore';
	import { onMount } from 'svelte';

	export let store;
	export let title;
	export let description;
	export let slides;

	let emblaApi;
	let options = { loop: false, inViewThreshold: 0.7, watchDrag: false, duration: 20 };
	let currentSlide = 0;
	let dotsContainerWidth;

	function onInit(event) {
		emblaApi = event.detail;
	}

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<svelte:document
	on:click={(e) => {
		// if (initializing) return;
		// if (
		// 	!e.target.classList.contains('modal') &&
		// 	e.target.name !== 'title' &&
		// 	e.target.name !== 'description' &&
		// 	e.target.type !== 'submit'
		// ) {
		// 	const checkUser = confirm('Are you sure you want to close this modal?');
		// 	if (checkUser) {
		// 		modalOpenState.set(false);
		// 		// modalComponent.set(null);
		// 		// modalProps.set(null);
		// 		// modalStateStore.set(null);
		// 	}
		// }
	}}
/>

<div
	class="modal embla"
	class:sideBarOpen={$sideBarState}
	class:homePageInfoModal={store === 'homePageInfoStore'}
	class:gamePageInfoModal={store === 'gamePageInfoStore'}
	class:editorPageInfoModal={store === 'editorPageInfoStore'}
	use:emblaCarouselSvelte={{ options }}
	on:emblaInit={onInit}
	style="--dotsContainerWidth: {dotsContainerWidth}px; {themeString}"
>
	<div class="modal-content embla__container">
		<!-- <h1>{title}</h1>
		<p>{description}</p> -->
		{#if slides}
			{#each slides as slide, i (`index_${i}`)}
				<div class="embla__slide index_{i}">
					<button
						disabled={currentSlide === 0}
						class:disabled={currentSlide === 0}
						class="prev"
						on:click={() => {
							emblaApi?.scrollPrev();

							if (currentSlide > 0) {
								currentSlide -= 1;
							}
						}}>back</button
					>
					<h1>{slide.title}</h1>

					{#if (slide?.images?.length === 1 && currentSlide !== 0) || (slide?.images?.length === 1 && slide?.imageLarge)}
						<div class="image__container">
							<img
								src={slide.images[0]}
								class="slide__image"
								class:imageLarge={slide?.imageLarge}
								alt="slide visual"
							/>
						</div>
					{:else if slide?.images?.length > 1}
						<div class="image__container">
							{#each slide.images as image, i (`image_${i}`)}
								<img src={image} class="slide__image" alt="slide visual" />
							{/each}
						</div>
					{:else if slide?.images?.length === 1}
						<img src={slide.images[0]} class="slide__image" alt="slide visual" />
					{/if}

					<p>{slide.description}</p>

					<button
						class="next"
						on:click={() => {
							if (currentSlide < slides?.length - 1) {
								emblaApi?.scrollNext();
								currentSlide += 1;
							} else {
								switch (store) {
									case 'homePageInfoStore':
										homePageInfoStore.set({ ...$homePageInfoStore, viewed: true });
										modalFullInfoStore.set(null);
										break;
									case 'gamePageInfoStore':
										gamePageInfoStore.set({ ...$gamePageInfoStore, viewed: true });
										modalFullInfoStore.set(null);
										break;
									case 'editorPageInfoStore':
										editorPageInfoStore.set({ ...$editorPageInfoStore, viewed: true });
										modalFullInfoStore.set(null);
										break;
									case 'libraryPageInfoStore':
										// sideBarState.set(true);
										break;
									default:
										break;
								}
							}
						}}>{currentSlide === slides?.length - 1 ? 'Done' : 'Continue'}</button
					>
				</div>
			{/each}
		{/if}
	</div>
	<div class="embla__dots" bind:clientWidth={dotsContainerWidth}>
		{#each Array.from({ length: slides?.length }, (_, i) => i) as i}
			<EmblaDot
				{currentSlide}
				scrollTo={emblaApi?.scrollTo}
				selectedScrollSnap={emblaApi?.selectedScrollSnap}
				index={i}
			/>
		{/each}
	</div>
</div>

<style>
	.embla__dots {
		display: flex;
		width: fit-content;
		height: fit-content;
		position: absolute;
		bottom: 28px;
		justify-content: center;
		align-items: flex-end;
		height: fit-content;
		left: calc(50% - var(--dotsContainerWidth) / 2);
	}
	.modal {
		position: fixed;
		z-index: 1000;
		width: 50%;
		height: 50%;
		background-color: var(--button-highlight);
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		justify-self: center;
		align-self: center;
		border-radius: 8px;
		height: fit-content;
		max-height: 50vh;
		top: 25%;
		color: var(--color-primary);
		left: calc(50% / 2);
		min-height: 45%;
		max-width: 600px;
		/* padding: 0 1rem; */
	}
	.modal.sideBarOpen {
		left: calc(25% + 230px / 2);
	}

	.embla {
		overflow: hidden;
	}
	.embla__container {
		display: flex;
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
		min-height: 250px;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* height: 100%; */
	}
	button {
		position: relative;
		/* top: 50%; */
		/* transform: translateY(-50%); */
	}
	button:hover {
		cursor: pointer;
	}
	button.prev {
		align-self: flex-start;
		background: none;
		border: none;
		color: var(--vibrant-blue);
		padding: 20px;
		font-size: 1rem;
		position: absolute;
	}
	button.next {
		align-self: center;
		position: absolute;
		bottom: -45px;
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: 1.1rem;
		background: var(--vibrant-blue);
		padding: 10px;
		margin-bottom: 20px;
		width: 50%;
		border-radius: 25px;
	}
	.slide__image {
		width: 25%;
		height: 25%;
		position: relative;
		/* left: calc(50% / 2 - 319.39px / 6); */
	}
	h1 {
		font-family: var(--header-font);
		padding: 0 2rem;
		font-size: 1.5rem;
	}
	p {
		padding: 0 2rem;
		margin-top: 30px;
		font-family: 'Geologica';
		font-weight: 200;
		max-height: 100px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.modal-content {
		max-width: 100%;
	}
	button.disabled {
		opacity: 0;
	}
	div.image__container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		width: 100%;
		height: fit-content;
	}
	div.image__container img {
		width: 30%;
		height: auto;
		border-radius: 6px;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
	}
	div.image__container img.imageLarge {
		height: 85px;
		width: auto;
	}

	/* Play Page Styles */
	.modal.gamePageInfoModal .embla__slide.index_0 img {
		width: 55%;
		height: auto;
		border-radius: 6px;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
	}

	.modal.gamePageInfoModal .embla__slide.index_1 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_2 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_3 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_4 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_5 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_6 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_7 div.image__container img,
	.modal.gamePageInfoModal .embla__slide.index_11 div.image__container img {
		width: 55%;
		height: auto;
		border-radius: 6px;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
	}

	/* Editor Page Styles */
	.modal.editorPageInfoModal .embla__slide.index_0 div.image__container img {
		width: 55%;
		height: auto;
	}
	.modal.editorPageInfoModal .embla__slide button.next,
	.modal.gamePageInfoModal .embla__slide button.next {
		margin-bottom: unset;
		bottom: unset;
		position: unset;
	}
	.modal.editorPageInfoModal .embla__slide.index_1 div.image__container img {
		width: 65%;
	}
	.modal.editorPageInfoModal .embla__slide.index_3 div.image__container img {
		width: 50%;
		height: auto;
	}
	.modal.editorPageInfoModal .embla__slide.index_2 div.image__container img,
	.modal.editorPageInfoModal .embla__slide.index_4 div.image__container img,
	.modal.editorPageInfoModal .embla__slide.index_6 div.image__container img {
		width: 55%;
		height: auto;
	}
	.modal.editorPageInfoModal .embla__slide.index_5 div.image__container img {
		width: 45%;
		height: auto;
	}
	@media (max-width: 498px) {
		.modal {
			width: 100%;
			border-radius: 0;
			height: 100%;
			max-height: unset;
			top: 0;
			left: 0;
		}
	}
</style>
