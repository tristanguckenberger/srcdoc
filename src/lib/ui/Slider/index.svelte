<script>
	// @ts-nocheck
	import { afterNavigate } from '$app/navigation';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';

	export let navActionHeight = 0;
	export let gamesAvailable = [];

	let emblaApi;
	let options = { axis: 'y' };
	let slideInView = 0;
	let pointerDown = false;
	let currentGame = gamesAvailable[slideInView];
	let initialId = gamesAvailable[slideInView]?.id;

	const onInit = (event) => {
		// Get the Embla API
		emblaApi = event.detail;
		emblaApi.scrollTo(1, true);

		// Listen to Embla events
		emblaApi.on('select', onSelect);
		emblaApi.on('scroll', onScroll);
		emblaApi.on('settle', onSettle);
		emblaApi.on('pointerUp', onPointerUp);
		emblaApi.on('pointerDown', onPointerDown);
		// Initialize Slider vars
		slideInView = emblaApi.slidesInView();
	};
	const onScroll = async (emblaApi, eventName) => {
		if (!pointerDown && emblaApi.slidesInView()?.length === 1) {
			await tick();
			slideInView = emblaApi.slidesInView()[0];
		}
	};
	const onPointerDown = (event) => {
		pointerDown = true;
	};
	const onPointerUp = (event) => {
		pointerDown = false;
	};
	const onSelect = async (emblaApi, eventName) => {
		if (!pointerDown && emblaApi.slidesInView()?.length === 1) {
			await tick();
			slideInView = emblaApi.slidesInView()[0];
		}
	};
	const onSettle = async (emblaApi, eventName) => {
		slideInView = 1;
	};

	afterNavigate(async () => {
		if (emblaApi && !pointerDown) {
			emblaApi.reInit();
			slideInView = 1;
			emblaApi.scrollTo(1, true);
			if (!pointerDown && emblaApi.slidesInView()?.length === 1) {
				await tick();
				slideInView = emblaApi.slidesInView()[0];
			}
		}

		if (initialId !== gamesAvailable[slideInView]?.id) {
			initialId = gamesAvailable[slideInView]?.id;
		}
	});
	onDestroy(() => {
		emblaApi.destroy();
	});

	$: (async () => {
		if (currentGame?.id !== gamesAvailable[slideInView]?.id && !pointerDown) {
			await goto(`/games/${gamesAvailable[slideInView]?.id}/play`);
			await invalidateAll();
			currentGame = gamesAvailable[slideInView];
		}
	})();
</script>

<div class="embla" use:emblaCarouselSvelte={{ options }} on:emblaInit={onInit}>
	<div class="embla__container">
		{#each gamesAvailable as game, i (`${game?.id}_index_${i}`)}
			<div class="output-paused-overlay game_option_{i} embla__slide">
				<div class="overlay-blur" />
				<div class="overlay-light-fade" />
				<div class="nav-action" bind:clientHeight={navActionHeight}>
					<div class="action-rift">
						<div class="rift-clip" />
					</div>
				</div>
				<div class="info-container">
					<h1>{game?.title}</h1>
					<p>{game?.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.nav-action {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8px;
		top: 0px;
		overflow: hidden;
		/* z-index: 100; */
	}
	.action-rift {
		position: absolute;
		height: 100%;
		width: 5px;
		top: 0;
		left: calc(50% - 2.5px);
		/* z-index: 10; */
	}
	.output-paused-overlay {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
		display: block;
	}
	.overlay-blur {
		position: absolute;
		width: 100%;
		height: 100%;
		background-image: url(https://picsum.photos/600/600);
		border-radius: 8px;
		filter: saturate(180%) blur(20px);
		top: 0;
	}
	.overlay-light-fade {
		background-color: rgba(255, 255, 255, 0.1);
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}
	.info-container {
		position: absolute;
		width: 72%;
		height: 100%;
		top: -55px;
		display: flex;
		flex-direction: column;
		left: 10vw;
		justify-content: center;
		align-items: flex-start;
		padding: 0 20px;
		color: #fff;
	}
	.info-container h1 {
		font-family: 'Inter';
		font-size: 2.75rem;
		margin-block-end: 0;
		text-shadow: 1px 2px 20px #0000003b;
	}
	.info-container p {
		font-family: 'Montserrat';
		font-size: 1rem;
		font-weight: 300;
		margin-block-start: 0;
		text-shadow: 1px 2px 20px #0000003b;
	}
	.embla {
		overflow: hidden;
		height: 100%;
	}
	.embla__container {
		display: flex;
		height: 100%;
		flex-direction: column;
		gap: 10px;
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}
</style>
