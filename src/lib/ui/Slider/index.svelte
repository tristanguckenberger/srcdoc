<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';
	// import { fade } from 'svelte/transition';
	import { session } from '$lib/stores/sessionStore';
	import {
		actionMenuOpen,
		currentGame as currentGameStore,
		topGame,
		bottomGame,
		gameCommentCount,
		gameFavoriteCount,
		gameFavorites
	} from '$lib/stores/gamesStore';
	import { page } from '$app/stores';

	export let navActionHeight = 0;
	export let gamesAvailable = [];
	export let currentIndex = 0;
	export let thumbnail;
	export let favoritesObj = {};

	$: favoritesCount = favoritesObj?.count;

	let emblaApi;
	let options = { axis: 'y', duration: 25, inViewThreshold: 0.7 };
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

	async function shareGame() {
		// if (browser) {
		// 	console.log('shareGame::page::', $page);
		// }
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Check out this game!',
					text: 'I found this cool game on Play Engine. Check it out!',
					url: $page?.url?.href // The URL to the game or content you want to share
				});
				console.log('Content shared successfully');
			} catch (error) {
				console.error('Error sharing content', error);
			}
		} else {
			console.log('Web Share API is not supported in your browser.');
			// Implement a fallback sharing mechanism here if necessary
		}
	}
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
		console.log('pointerDown', pointerDown);
		if (nextGame?.id !== currentGame?.id) {
			setTimeout(async () => {
				currentGame = nextGame;
				$currentGameStore = currentGame;
				//
				await goto(`/games/${nextGame?.id}/play`);
				await invalidateAll();
				await tick();
			}, 550);
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
				tick();
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
					class:drawerOpen={$drawerOpen}
					style="--bg_{i}: url('{game?.thumbnail ?? 'https://picsum.photos/600/600'}');"
				/>
				<div class="overlay-light-fade" />
				<div class="nav-action" bind:clientHeight={navActionHeight}>
					<div class="action-rift">
						<div class="rift-clip" />
					</div>
				</div>

				{#if $session?.id === game?.user_id}
					<button
						class="settings-action"
						class:drawerOpen={$drawerOpen}
						on:click={() => {
							browser && selectedOption.set(3);
							drawerOpen.set(true);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="36"
							height="36"
							fill="#ffffff"
							viewBox="0 0 256 256"
							class="action-button-icon"
							><path
								d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
							/></svg
						>
					</button>
				{/if}

				<div class="info-container" class:drawerOpen={$drawerOpen}>
					<h1>
						{game?.title}
					</h1>
					<p>
						{game?.description}
					</p>
					<button on:click={shareGame}>Share This Game</button>
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
		overflow-wrap: anywhere;
	}
	.info-container p {
		font-family: 'Montserrat';
		font-size: 1rem;
		font-weight: 300;
		margin-block-start: 0;
		text-shadow: 1px 2px 20px #0000003b;
		overflow-wrap: anywhere;
	}
	.info-container.drawerOpen {
		/* top: unset;
		position: relative; */
		transform: translateY(-35%);
		transition-delay: 2ms;
	}
	.info-container.drawerOpen h1,
	.info-container.drawerOpen p {
		filter: brightness(0.4);
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
	@media (max-width: 498px) {
		.embla__container {
			gap: 0px;
		}
		.overlay-blur {
			border-radius: 0px;
		}
		.output-paused-overlay {
			border-radius: 0px;
		}
		.overlay-light-fade {
			border-radius: 0px;
		}
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}
	button.settings-action {
		position: absolute;
		top: 20px;
		right: 16px;
		z-index: 1000000000000000;
		background: unset;
		border-style: unset;
	}
	button.settings-action:hover {
		cursor: pointer;
	}
	.overlay-blur.drawerOpen {
		filter: saturate(180%) blur(20px) brightness(0.4);
	}
</style>
