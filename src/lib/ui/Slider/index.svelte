<script>
	// @ts-nocheck

	// Svelte Imports
	import { afterNavigate, preloadData, goto, beforeNavigate } from '$app/navigation';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	// 3rd Party Libs & Utils
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	// import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
	import { debounce } from 'lodash-es';

	// Stores & Utils
	import {
		hidePlayButtonStore,
		lockGameStateStore,
		allowNavigationStore
	} from '$lib/stores/gameControllerStore';
	import { actionMenuOpen, currentGame as currentGameStore } from '$lib/stores/gamesStore';
	import { playButton, gameFavoriteCount, gameFavorites } from '$lib/stores/gamesStore.js';
	import { emblaInstance, triggerNavigation } from '$lib/stores/sliderStore';
	import { preloadItemsInRange } from '$lib/utils/preloadItemsInRange';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';
	import { session } from '$lib/stores/sessionStore';
	import { platformSession } from '$lib/stores/platformSession';

	// Component Library Imports
	import ToolTip from '$lib/ui/ToolTip/index.svelte';

	// Props
	export let navActionHeight = 0;
	export let gamesAvailable = [];
	export let rawGamesData = [];
	export let currentIndex = 0;
	export let favoritesObj = {};
	export let currentGameExport = {};

	let emblaApi;
	let options = { axis: 'y', duration: 25, inViewThreshold: 0.7 };
	let slideInView = 1;
	let pointerDown = false;
	let currentGame;
	let initialId;
	let slidesSettled = true;
	let hideActionNav = true;
	let timeout;
	let isFavorited = false;
	let doNavigate = false;
	let showSlides = false;
	let showToolTip = false;
	let showLeaderToolTip = false;
	let showReviewsToolTip = false;
	let showSettingsToolTip = false;
	let showCommentsToolTip = false;
	let showFavoritesToolTip = false;
	let showAddToPlaylistToolTip = false;
	let showNextGameToolTip = false;
	let showPrevGameToolTip = false;

	const linkBuilder = (game) =>
		isPlaylistSlider ? `/games/playlist/${playlistId}/${game?.id}/play` : `/games/${game?.id}/play`;

	const handleExpandMore = () => {
		$actionMenuOpen = !$actionMenuOpen;
	};

	const emblaPreloader = async (game, preload = preloadData) => {
		const gameLink = linkBuilder(game);
		if (browser) {
			await preload(gameLink);
		}
	};

	async function shareGame() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Check out this game!',
					text: 'I found this cool game on Play Engine. Check it out!',
					url: $page?.url?.href
				});
			} catch (error) {
				console.error('Error sharing content', error);
			}
		} else {
			console.log('Web Share API is not supported in your browser.');
		}
	}

	const onInit = (event) => {
		emblaApi = event.detail;
		emblaApi.scrollTo(1, true);
		emblaApi.on('pointerUp', debounce(onPointerUp, 300));
		emblaApi.on('pointerDown', debounce(onPointerDown, 300));
		emblaInstance.set(emblaApi);
		slideInView = 1;
		currentGame = gamesAvailable[1];
		initialId = gamesAvailable[1]?.id;
		preloadItemsInRange(emblaPreloader, rawGamesData, currentIndex, 1, 1);
		showSlides = true;
		// emblaApi.debouncedReInit = debounce(emblaApi.reInit, 350);
	};

	const performNavigation = async () => {
		const nextGame = gamesAvailable[emblaApi?.selectedScrollSnap()];
		if (nextGame?.id !== currentGame?.id && $lockGameStateStore === false) {
			lockGameStateStore.set(true);
			currentGame = nextGame;
			$currentGameStore = currentGame;
			gamesAvailable[emblaApi?.selectedScrollSnap()];
			goto(
				isPlaylistSlider
					? `/games/playlist/${playlistId}/${nextGame?.id}/play`
					: `/games/${nextGame?.id}/play`,
				{ replaceState: false }
			);
			emblaApi?.scrollTo(1, true);
		}
	};

	const debouncedNavigation = debounce(performNavigation, 150);
	const onPointerDown = (event) => {
		if (!$allowNavigationStore) {
			allowNavigationStore.set(true);
		}
		lockGameStateStore.set(false);
		pointerDown = true;
		slidesSettled = false;
		hidePlayButtonStore.set(true);
	};

	const onPointerUp = (event) => {
		pointerDown = false;
		setTimeout(() => {
			hidePlayButtonStore.set(false);
		}, 300);
	};

	const handleKeyUp = async (event) => {
		if (event.key === 'ArrowDown') {
			emblaApi?.scrollPrev();
			setTimeout(() => {
				triggerNavigation.set(true);
			}, 350);
		}

		if (event.key === 'ArrowUp') {
			emblaApi?.scrollNext();
			setTimeout(() => {
				triggerNavigation.set(true);
			}, 350);
		}
	};
	const debouncedKeyUp = debounce(handleKeyUp, 350);

	onMount(async () => {
		hideActionNav = false;
		$actionMenuOpen = true;
	});

	afterUpdate(async () => {
		console.log('isPlaylistSlider::', isPlaylistSlider);
		// Update favorites store and count
		gameFavoriteCount.set(favoritesCount);
		gameFavorites.set(favoritesObj);

		// Check if the selected slide is not 1 for more than 1 second
		if ((await emblaApi?.selectedScrollSnap()) !== 1) {
			// Clear any existing timeout to reset the timer
			clearTimeout(timeout);

			// Set a new timeout
			timeout = setTimeout(async () => {
				// Action to perform if condition is met for longer than 1 second
				const nextGame = gamesAvailable[emblaApi?.selectedScrollSnap()];
				if (nextGame?.id !== currentGame?.id && !$lockGameStateStore) {
					debouncedNavigation(nextGame);
				}
			}, 800); // 1 second
		} else {
			// If the selected slide is 1, clear the timeout
			clearTimeout(timeout);
		}

		// Check and set if the current game is favorited
		// favoritesObj?.favorites?.some((fav) => {
		// 	if (
		// 		fav?.user_id === $platformSession?.currentUser?.id &&
		// 		fav?.game_id === $currentGameStore?.id
		// 	) {
		// 		isFavorited = true;
		// 	} else {
		// 		isFavorited = false;
		// 	}
		// });

		isFavorited = favoritesObj?.favorites?.some((fav) => {
			return (
				fav?.user_id?.toString() === $platformSession?.currentUser?.id?.toString() &&
				fav?.game_id?.toString() === currentGameExport?.id?.toString()
			);
		});

		if (
			(!pointerDown &&
				emblaApi?.slidesInView()?.length === 1 &&
				emblaApi?.selectedScrollSnap() !== 1) ||
			((doNavigate || $triggerNavigation) &&
				!pointerDown &&
				emblaApi?.slidesInView()?.length === 1 &&
				emblaApi?.selectedScrollSnap() !== 1)
		) {
			const nextGame = gamesAvailable[emblaApi?.selectedScrollSnap()];
			if (nextGame?.id !== currentGame?.id) {
				doNavigate = false;
				triggerNavigation.set(false);
				debouncedNavigation(nextGame);
			}
		}

		if (emblaApi?.slidesInView()?.length === 1 && !pointerDown) {
			slidesSettled = true;
		}

		if (slidesSettled) {
			setTimeout(async () => {
				tick().then(async () => {
					emblaApi?.reInit();
				});
			}, 300);
		}
	});

	beforeNavigate(async (event) => {
		pointerDown = false;
	});

	afterNavigate(async (event) => {
		// Reset state or cleanup after navigation
		if (emblaApi) {
			tick().then(async () => {
				currentGame = gamesAvailable[1];
				currentGameStore.set(currentGame);
				preloadItemsInRange(emblaPreloader, rawGamesData, currentIndex, 1, 1);
				lockGameStateStore.set(false);
			});
		}
	});

	onDestroy(() => {
		emblaInstance.set(null);
		emblaApi?.destroy();
		clearTimeout(debouncedNavigation);
	});

	const checkAndReturnThumbnail = (game) => {
		if (game?.thumbnail) {
			return game?.thumbnail;
		} else {
			return 'https://picsum.photos/600/600';
		}
	};

	$: currentIndex = rawGamesData?.findIndex((game) => game?.id === currentGame?.id);
	$: $currentGameStore = currentGameExport;
	$: hideActionNav = !$actionMenuOpen;
	$: favoritesCount = favoritesObj?.count;
	$: slidesSettled = !pointerDown && emblaApi?.slidesInView()?.length === 1;
	$: isPlayPage = $page?.route?.id === '/games/[slug]/play';
	$: visibleThumbnails = showSlides;
	$: isPlaylistSlider = $page?.route?.id === '/games/playlist/[playlistId]/[gameSlug]/play';
	$: playlistId = $page?.params?.playlistId;

	let load = false;
</script>

<svelte:window on:keyup={debouncedKeyUp} />

<!-- {#if load} -->
{#await gamesAvailable}
	<p>Loading...</p>
{:then}
	{#if gamesAvailable?.length > 0}
		<div class="embla" use:emblaCarouselSvelte={{ options }} on:emblaInit={onInit}>
			<div class="embla__container">
				{#each gamesAvailable as game, i (`${game?.id}_index_${i}`)}
					<div class="output-paused-overlay game_option_{i} embla__slide">
						<div
							class="overlay-blur blur_{i}"
							class:drawerOpen={$drawerOpen}
							style="--bg_{i}: url('{visibleThumbnails
								? checkAndReturnThumbnail(game)
								: 'https://picsum.photos/600/600'}');"
						/>
						<div class="overlay-light-fade" />
						<div class="nav-action" bind:clientHeight={navActionHeight}>
							<div class="action-rift">
								<div class="rift-clip" />
							</div>
						</div>

						{#if $platformSession?.currentUser?.id === game?.user_id}
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
						{#if isPlayPage}
							{#if !$playButton}
								{#if !$drawerOpen}
									<ul class="action-menu" class:fade={true}>
										<div class="sub-action-menu">
											{#if $platformSession?.currentUser?.id === game?.user_id}
												<a
													class="action-button button"
													href={`/games/${$currentGameStore?.id}/engine`}
													on:mouseover={() => {
														showToolTip = true;
													}}
													on:mouseleave={() => {
														showToolTip = false;
													}}
												>
													<svg
														class="action-button-icon"
														xmlns="http://www.w3.org/2000/svg"
														width="36"
														height="36"
														fill="#ffffff"
														viewBox="0 0 256 256"
														><path
															d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"
														/></svg
													>
													{#if showToolTip}
														<ToolTip text="Open In Editor" position="left" />
													{/if}
												</a>
											{/if}

											<button
												class="action-button button"
												on:click={() => {
													$playButton = false;

													$selectedOption = 2;

													$playButton = false;
													$drawerOpen = true;
												}}
												on:mouseover={() => {
													showReviewsToolTip = true;
												}}
												on:mouseleave={() => {
													showReviewsToolTip = false;
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="36"
													height="36"
													fill="#ffffff"
													viewBox="0 0 256 256"
													><path
														d="M234.29,114.85l-5.06,4.37a8,8,0,0,1-10.45-12.12l5.06-4.37c.12-.1.23-.19.13-.5s-.18-.27-.34-.29l-8.27-.67a8,8,0,1,1,1.29-15.94l8.27.66a16.46,16.46,0,0,1,9.37,28.86Zm-61.71,37.79,4.08,17.22a8,8,0,0,0,7.78,6.16,7.86,7.86,0,0,0,1.85-.22,8,8,0,0,0,5.94-9.63l-3-12.49,8-6.86a8,8,0,0,0-10.45-12.12l-11.64,10A8,8,0,0,0,172.58,152.64Zm29.13,53.53a8,8,0,0,0-15.57,3.69l1.32,5.58a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-6.72-4.13a8,8,0,0,0-8.38,13.63l6.72,4.13A16.4,16.4,0,0,0,203,211.75ZM175.36,98.05l-15.64-1.27A8,8,0,0,1,153,91.86L136,50.78V184.63l7.43,4.57a8,8,0,1,1-8.38,13.63L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,10.76.87a8,8,0,1,1-1.29,16ZM120,184.63V50.78L103,91.86a8,8,0,0,1-6.75,4.92l-63.92,5.16c-.15,0-.24,0-.33.29a.39.39,0,0,0,.13.51l48.7,42a8,8,0,0,1,2.56,7.91l-14.88,62.8a.37.37,0,0,0,.17.48c.18.14.23.11.38,0Z"
													/></svg
												>
												{#if showReviewsToolTip}
													<ToolTip text="View Reviews" position="left" />
												{/if}
											</button>

											<button
												class="action-button button"
												on:click={() => {
													$playButton = false;

													$selectedOption = 4;

													$playButton = false;
													$drawerOpen = true;
												}}
												on:mouseover={() => {
													showLeaderToolTip = true;
												}}
												on:mouseleave={() => {
													showLeaderToolTip = false;
												}}
											>
												<svg
													class="action-button-icon"
													width="27"
													height="16"
													viewBox="0 0 27 16"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M14.3734 2.53932C14.3734 2.31509 14.4625 2.10004 14.621 1.94149C14.7796 1.78293 14.9947 1.69385 15.2189 1.69385H25.3645C25.5888 1.69385 25.8038 1.78293 25.9624 1.94149C26.1209 2.10004 26.21 2.31509 26.21 2.53932C26.21 2.76356 26.1209 2.97861 25.9624 3.13716C25.8038 3.29572 25.5888 3.38479 25.3645 3.38479H15.2189C14.9947 3.38479 14.7796 3.29572 14.621 3.13716C14.4625 2.97861 14.3734 2.76356 14.3734 2.53932ZM25.3645 6.76667H15.2189C14.9947 6.76667 14.7796 6.85575 14.621 7.01431C14.4625 7.17286 14.3734 7.38791 14.3734 7.61214C14.3734 7.83638 14.4625 8.05143 14.621 8.20998C14.7796 8.36854 14.9947 8.45761 15.2189 8.45761H25.3645C25.5888 8.45761 25.8038 8.36854 25.9624 8.20998C26.1209 8.05143 26.21 7.83638 26.21 7.61214C26.21 7.38791 26.1209 7.17286 25.9624 7.01431C25.8038 6.85575 25.5888 6.76667 25.3645 6.76667ZM25.3645 11.8395H17.7553C17.5311 11.8395 17.316 11.9286 17.1575 12.0871C16.9989 12.2457 16.9098 12.4607 16.9098 12.685C16.9098 12.9092 16.9989 13.1242 17.1575 13.2828C17.316 13.4414 17.5311 13.5304 17.7553 13.5304H25.3645C25.5888 13.5304 25.8038 13.4414 25.9624 13.2828C26.1209 13.1242 26.21 12.9092 26.21 12.685C26.21 12.4607 26.1209 12.2457 25.9624 12.0871C25.8038 11.9286 25.5888 11.8395 25.3645 11.8395ZM10.7051 9.09172C11.5442 8.44542 12.16 7.55269 12.4661 6.53874C12.7721 5.52478 12.7531 4.44046 12.4118 3.43783C12.0704 2.43521 11.4238 1.56458 10.5626 0.948048C9.70138 0.331514 8.6688 0 7.60966 0C6.55052 0 5.51794 0.331514 4.65673 0.948048C3.79553 1.56458 3.14891 2.43521 2.80754 3.43783C2.46618 4.44046 2.44719 5.52478 2.75326 6.53874C3.05932 7.55269 3.67508 8.44542 4.51418 9.09172C2.33498 10.0143 0.61762 11.8712 0.0268472 14.1645C-0.00542023 14.2895 -0.00864689 14.4202 0.0174145 14.5466C0.0434758 14.673 0.0981333 14.7918 0.177198 14.8938C0.256262 14.9958 0.357635 15.0784 0.473545 15.1352C0.589455 15.192 0.716827 15.2214 0.845896 15.2214H14.3734C14.5025 15.2214 14.6299 15.192 14.7458 15.1352C14.8617 15.0784 14.9631 14.9958 15.0421 14.8938C15.1212 14.7918 15.1758 14.673 15.2019 14.5466C15.228 14.4202 15.2247 14.2895 15.1925 14.1645C14.6017 11.8701 12.8843 10.0133 10.7051 9.09172Z"
														fill="white"
														fill-opacity="0.81"
													/>
												</svg>
												{#if showLeaderToolTip}
													<ToolTip text="View Leaderboards" position="left" />
												{/if}
											</button>

											<button
												class="action-button button"
												on:click={() => {
													$playButton = false;
													if (browser) {
														$selectedOption = 0;
													}
													$playButton = false;
													$drawerOpen = true;
												}}
												on:mouseover={() => {
													showCommentsToolTip = true;
												}}
												on:mouseleave={() => {
													showCommentsToolTip = false;
												}}
											>
												<svg
													class="action-button-icon"
													width="27"
													height="27"
													viewBox="0 0 27 27"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M17.8228 11.5324C17.8228 11.8105 17.7123 12.0771 17.5157 12.2737C17.3191 12.4703 17.0525 12.5808 16.7744 12.5808H8.3872C8.10915 12.5808 7.84248 12.4703 7.64587 12.2737C7.44926 12.0771 7.3388 11.8105 7.3388 11.5324C7.3388 11.2543 7.44926 10.9877 7.64587 10.7911C7.84248 10.5945 8.10915 10.484 8.3872 10.484H16.7744C17.0525 10.484 17.3191 10.5945 17.5157 10.7911C17.7123 10.9877 17.8228 11.2543 17.8228 11.5324ZM16.7744 14.6776H8.3872C8.10915 14.6776 7.84248 14.7881 7.64587 14.9847C7.44926 15.1813 7.3388 15.4479 7.3388 15.726C7.3388 16.0041 7.44926 16.2707 7.64587 16.4673C7.84248 16.6639 8.10915 16.7744 8.3872 16.7744H16.7744C17.0525 16.7744 17.3191 16.6639 17.5157 16.4673C17.7123 16.2707 17.8228 16.0041 17.8228 15.726C17.8228 15.4479 17.7123 15.1813 17.5157 14.9847C17.3191 14.7881 17.0525 14.6776 16.7744 14.6776ZM26.21 13.105C26.2062 16.5795 24.8243 19.9106 22.3674 22.3674C19.9106 24.8243 16.5795 26.2062 13.105 26.21H2.05355C1.50913 26.2093 0.987204 25.9927 0.602238 25.6078C0.217272 25.2228 0.000693534 24.7009 0 24.1564V13.105C5.17914e-08 9.62934 1.3807 6.29603 3.83837 3.83837C6.29603 1.3807 9.62934 0 13.105 0C16.5807 0 19.914 1.3807 22.3716 3.83837C24.8293 6.29603 26.21 9.62934 26.21 13.105ZM24.1132 13.105C24.1132 10.1854 22.9534 7.38547 20.889 5.32103C18.8245 3.25659 16.0246 2.0968 13.105 2.0968C10.1854 2.0968 7.38546 3.25659 5.32103 5.32103C3.25659 7.38547 2.0968 10.1854 2.0968 13.105V24.1132H13.105C16.0236 24.1101 18.8218 22.9493 20.8855 20.8855C22.9493 18.8218 24.1101 16.0236 24.1132 13.105Z"
														fill="white"
														fill-opacity="0.81"
													/>
												</svg>
												{#if showCommentsToolTip}
													<ToolTip text="View Comments" position="left" />
												{/if}
											</button>
											<form
												class="gameDetails new-project-form modal"
												method="POST"
												action={`/games/?/${isFavorited ? 'deleteFavorite' : 'createFavorite'}`}
												use:enhance={({ formElement, formData, action, cancel, redirect }) => {
													return async ({ result, update }) => {
														await update();
														if (result.status === 200) {
															gameFavorites.set(result?.data?.body?.favorites);
															gameFavoriteCount.set(result?.data?.body?.favorites?.length);
															isFavorited = !isFavorited;
														}
													};
												}}
											>
												<input type="hidden" name="gameId" value={$currentGameStore?.id} />
												<button
													class="action-button button favorites"
													class:muted={!$platformSession?.currentUser?.id}
													on:click={() => {}}
												>
													<svg
														width="27"
														height="23"
														viewBox="0 0 27 23"
														fill="red"
														xmlns="http://www.w3.org/2000/svg"
														class="fav action-button-icon"
														class:isFavorited={isFavorited && $gameFavoriteCount > 0}
													>
														<path
															d="M26.21 7.25455C26.21 15.4452 14.0656 22.0749 13.5485 22.3487C13.4122 22.422 13.2598 22.4604 13.105 22.4604C12.9502 22.4604 12.7978 22.422 12.6615 22.3487C12.1444 22.0749 0 15.4452 0 7.25455C0.00216787 5.33119 0.767181 3.48723 2.1272 2.1272C3.48723 0.767181 5.33119 0.00216787 7.25455 0C9.67079 0 11.7863 1.03904 13.105 2.79534C14.4237 1.03904 16.5392 0 18.9554 0C20.8788 0.00216787 22.7228 0.767181 24.0828 2.1272C25.4428 3.48723 26.2078 5.33119 26.21 7.25455Z"
															fill="white"
															fill-opacity="0.81"
														/>
													</svg>
													<span class="favorite">{$gameFavoriteCount ?? 0}</span>
												</button>
											</form>
											<!-- <h1 class="highlight">{$gameFavoriteCount}</h1> -->

											<form class="gameDetails new-project-form modal" method="POST">
												<input type="hidden" name="gameId" value={$currentGameStore?.id} />
												<button
													class="action-button button add-to-playlist"
													class:muted={!$platformSession?.currentUser?.id}
													on:click|preventDefault={() => {
														if (!$platformSession?.currentUser?.id) {
															return;
														}
														$playButton = false;
														if (browser) {
															$selectedOption = 6;
														}
														$playButton = false;
														$drawerOpen = true;
													}}
													on:mouseover={() => {
														showAddToPlaylistToolTip = true;
													}}
													on:mouseleave={() => {
														showAddToPlaylistToolTip = false;
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="32"
														height="32"
														fill="#000000"
														viewBox="0 0 256 256"
														><path
															d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"
														/></svg
													>
													{#if showAddToPlaylistToolTip}
														<ToolTip text="Add Game To Playlist" position="left" />
													{/if}
												</button>
											</form>
											<!-- {/if} -->
										</div>
									</ul>
								{/if}
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
{:catch}
	<p>Failed to load games</p>
{/await}

<!-- {:else}
	Howdy
{/if} -->

<style>
	.highlight {
		color: var(--color-primary);
	}
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
		top: 25px;
		right: 25px;
		z-index: 1;
		background: unset;
		border-style: unset;
	}
	button.settings-action:hover {
		cursor: pointer;
	}
	.overlay-blur.drawerOpen {
		filter: saturate(180%) blur(20px) brightness(0.4);
	}
	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: none;
		position: relative;
	}
	.action-button:hover {
		cursor: pointer;
	}
	.action-button-icon {
		width: 30px;
		height: 100%;
	}
	.action-button-icon {
		filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3));
	}
	.play-button-container {
		position: absolute;
		bottom: 30px;
		right: 30px;
		height: 50px;
		top: 11px;
	}

	@media (min-width: 498px) {
		.play-button-container {
			position: absolute;
			bottom: 30px;
			right: 30px;
			height: 50px;
			top: 11px;
		}
	}

	.action-menu {
		position: absolute;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-items: center;
		bottom: 90px;
		right: 25px;
	}

	/* .sub-action-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-items: center;
	} */
	.action-menu .button {
		transition: transform 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
	}
	.action-menu .button.actionMenuOpen {
		transform: rotate(90deg);
	}
	.play-button {
		position: relative;
		z-index: 1;
		width: 36.5px;
		height: 36.5px;
		border-radius: 6px;
		transform: translateY(calc(var(--screenHeight)));
	}
	#primary-actions {
		margin-block-start: 40px;
	}
	.play-button.drawerOpen {
		transform: translateY(370%);
		transition: transform 0.3s linear 0.03s;
	}
	.play-button.drawerOpen svg {
		filter: brightness(0.4);
	}

	@media (max-width: 768px) {
		.play-button-container {
			top: -34px;
		}
	}
	.favorites {
		font-family: 'Inter';
		color: #dadada;
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-weight: 400;
		text-shadow: 0 0 3px black;
	}
	svg.fav path {
		/* transition: fill 0.3s ease; */
	}
	svg.isFavorited path {
		fill: red;
	}
	.action-menu button:focus {
		outline: none;
	}
	.action-menu button:focus-within {
		outline: none;
	}
	.action-menu button:focus-visible {
		outline: none;
	}
	.mobile-profile-btn {
		display: flex;
		align-items: center;
		padding-left: 10px;
	}
	@media (max-width: 498px) {
		main.editor.isPlayPage.isMobile {
			height: 100% !important;
		}
	}

	.play-button-container,
	.action-menu {
		opacity: 0;
		/* transition: opacity 0.3s linear 0.03s; */
	}

	.play-button-container.fade,
	.action-menu.fade {
		opacity: 1;
		/* transition: opacity 0.3s linear 0.06s; */
	}

	.sub-action-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-items: center;
	}
	.sub-action-menu {
		margin-bottom: 200px;
	}
	@media (min-width: 498px) {
		.play-button-container {
			bottom: 20px !important;
			top: unset !important;
			z-index: 1000000000000000;
		}
		.play-button {
			transform: unset !important;
		}
	}
	@media (max-width: 498px) {
		.play-button-container {
			bottom: 20px !important;
			top: unset !important;
			z-index: 1000000000000000;
		}
		.play-button {
			transform: unset !important;
		}
	}
	.divider {
		width: 42px;
		height: 150px;
		background-color: #ffffff24;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	@media (max-width: 498px) {
		.divider {
			height: 100px;
		}
	}
	.divider .slider-action svg {
		width: 100%;
		fill: white;
	}
	.slider-action.top-icon {
		padding-top: 5px;
	}
	.slider-action.bottom-icon {
		padding-bottom: 5px;
	}
	.slider-action:hover {
		cursor: pointer;
	}
	.action-menu,
	.slider-action {
		transition: opacity 0.08s cubic-bezier(0, 0.41, 0.3, 0.33);
	}
	.elip {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.expand-container-toggle {
		position: absolute;
		bottom: 160px;
		right: 100px;
	}
	.add-to-playlist svg {
		fill: var(--color-primary);
	}
	button.muted {
		opacity: 0.3;
	}
	button.muted:hover {
		cursor: not-allowed;
	}
</style>
