<script>
	// @ts-nocheck
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { drawerOpen } from '$lib/stores/drawerStore';
	import { fade } from 'svelte/transition';
	import {
		actionMenuOpen,
		currentGame as currentGameStore,
		topGame,
		bottomGame,
		gameCommentCount,
		gameFavoriteCount,
		gameFavorites
	} from '$lib/stores/gamesStore';

	export let navActionHeight = 0;
	export let gamesAvailable = [];
	export let currentIndex = 0;
	export let thumbnail;
	export let favoritesObj = {};

	$: console.log('slider::favoritesObj::', favoritesObj);
	$: favoritesCount = favoritesObj?.count;

	let emblaApi;
	let options = { axis: 'y', duration: 60 };
	let slideInView = 1;
	let pointerDown = false;
	let currentGame;
	let initialId;
	let shouldNavigate = false;
	let slidesSettled = true;
	let hideActionNav = true;

	onMount(() => {
		hideActionNav = false;
		$actionMenuOpen = true;
		// if (favoritesCount > 0) {

		// }
	});

	afterUpdate(() => {
		gameFavoriteCount.set(favoritesCount);
		gameFavorites.set(favoritesObj);
	});

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
		slideInView = 1;
		currentGame = gamesAvailable[slideInView];
		initialId = gamesAvailable[slideInView]?.id;
	};
	const onScroll = async () => {
		let nextGame;
		if (!pointerDown && emblaApi.slidesInView()?.length === 1) {
			slideInView = emblaApi?.selectedScrollSnap();
			nextGame = gamesAvailable[slideInView];
			slidesSettled = true;
		}
	};
	const onPointerDown = (event) => {
		pointerDown = true;
		slidesSettled = false;

		// ui vars
		$actionMenuOpen = false;
	};
	const onPointerUp = (event) => {
		pointerDown = false;
		$actionMenuOpen = true;

		// Handle navigation here
	};
	const onSelect = async () => {
		const nextGame = gamesAvailable[emblaApi?.selectedScrollSnap()];

		if (nextGame?.id !== currentGame?.id) {
			setTimeout(async () => {
				currentGame = nextGame;
				$currentGameStore = currentGame;
				await tick();
				await goto(`/games/${nextGame?.id}/play`);
				await invalidateAll();
			}, 200);
		}
	};
	const onSettle = async () => {
		// const nextGame = gamesAvailable[slideInView];
		// slidesSettled = true;
		/**
		 * If the current index is not 1
		 * and the nextGame is not the same as the game at index 1
		 * then navigate to the nextGame
		 */
		// if (emblaApi?.selectedScrollSnap() !== 1 && nextGame?.id !== gamesAvailable[1]?.id) {
		// 	shouldNavigate = true;
		// 	await tick();
		// 	await goto(`/games/${nextGame?.id}/play`);
		// 	await invalidateAll();
		// 	currentGame = nextGame;
		// }
	};
	const handleKeyUp = async (event) => {
		if (event.key === 'ArrowUp') {
			emblaApi?.scrollPrev();
		}

		if (event.key === 'ArrowDown') {
			emblaApi?.scrollNext();
		}
	};
	beforeNavigate(async () => {
		// slideInView = 1;
		// shouldNavigate = false;
	});
	afterNavigate(async () => {
		if (emblaApi && !pointerDown) {
			emblaApi.scrollTo(1, true);
			if (!pointerDown && emblaApi.slidesInView()?.length === 1) {
				await tick();
				currentGame = gamesAvailable[1];
				slideInView = 1;
			}
		}

		if (initialId !== gamesAvailable[1]?.id) {
			initialId = gamesAvailable[1]?.id;
		}

		$currentGameStore = currentGame;
	});
	onDestroy(() => {
		emblaApi?.destroy();
	});

	$: $currentGameStore = currentGame;
	$: hideActionNav = !$actionMenuOpen;
</script>

<svelte:window on:keyup={handleKeyUp} />

<div class="embla" use:emblaCarouselSvelte={{ options }} on:emblaInit={onInit}>
	<div class="embla__container">
		{#each gamesAvailable as game, i (`${game?.id}_index_${i}`)}
			<div class="output-paused-overlay game_option_{i} embla__slide">
				<div
					class="overlay-blur blur_{i}"
					style="--bg_{i}: url('{game?.thumbnail ?? 'https://picsum.photos/600/600'}');"
				/>
				<div class="overlay-light-fade" />
				<div class="nav-action" bind:clientHeight={navActionHeight}>
					<div class="action-rift">
						<div class="rift-clip" />
					</div>
				</div>

				<div class="info-container" class:drawerOpen={$drawerOpen}>
					{#if $actionMenuOpen}
						<h1 in:fade={{ delay: 350, duration: 400 }} out:fade={{ delay: 0, duration: 200 }}>
							{game?.title}
						</h1>
						<p in:fade={{ delay: 350, duration: 400 }} out:fade={{ delay: 0, duration: 200 }}>
							{game?.description}
						</p>
					{/if}
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
	}
	.action-rift {
		position: absolute;
		height: 100%;
		width: 5px;
		top: 0;
		left: calc(50% - 2.5px);
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
		background-position: center;
		background-size: cover;
		border-radius: 8px;
		filter: saturate(180%) blur(20px);
		top: 0;
	}
	.blur_0 {
		background-image: var(--bg_0);
	}
	.blur_1 {
		background-image: var(--bg_1);
	}
	.blur_2 {
		background-image: var(--bg_2);
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
		transition: transform 0.3s ease-in-out;
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
	.info-container.drawerOpen {
		/* top: unset;
		position: relative; */
		transform: translateY(-35%);
		transition-delay: 2ms;
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
