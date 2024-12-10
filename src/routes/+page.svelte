<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/authStore.js';
	import { onMount, setContext, getContext, afterUpdate, onDestroy } from 'svelte';
	import playbg from '$lib/assets/playbg.svg';
	import bg from '$lib/assets/bg.svg';
	import Frame from '$lib/assets/Frame.svg';
	import playenginelogo from '$lib/assets/playenginelogo.svg';
	import SignInForm from '$lib/ui/Form/SignInForm.svelte';
	import SignUpForm from '$lib/ui/Form/SignUpForm.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import Logo from '$lib/ui/Logo/index.svelte';
	import ResponsiveLogo from '$lib/ui/ResponsiveLogo/index.svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import MockEditor from '$lib/ui/MockEditor/index.svelte';
	import MockSlider from '$lib/ui/MockSlider/index.svelte';
	import MockPlay from '$lib/ui/MockPlay/index.svelte';
	import HorizontalList from '$lib/ui/HorizontalList/index.svelte';
	import ForgotPasswordRequest from '$lib/ui/Form/ForgotPasswordRequest.svelte';
	import { platformSession } from '$lib/stores/platformSession/index.js';
	import { authWidthStore } from '$lib/stores/authStore.js';
	import { stackTimeout } from '$lib/stores/modalStackStore.js';

	export let form;
	export let data;

	let quickHide = false;
	let lockXDistance;
	let lockedWidth = 0;
	let lockedRightWidth = 0;
	let previousShowAuthVal = false;
	let pageWidth = 0;
	let isMobile = false;
	const authFlowOptions = [
		{ option: 'register', component: SignUpForm },
		{ option: 'login', component: SignInForm },
		{ option: 'forgotPassword', component: ForgotPasswordRequest }
	];
	let selected = authFlowOptions[0];

	onMount(async () => {
		$platformSession?.currentUser?.id && browser && goto('/games');

		// Gets a list of users for checking if a username is taken during registration
		if (!$platformSession?.currentUser?.username) {
			const userData = data?.sessionData?.username
				? data?.sessionData
				: {
						body: await getAllUsers()
				  };

			userData && userStore.set(userData?.body?.users);
		}
	});

	const getAllUsers = async () => {
		const userReqHeaders = new Headers();
		const userReqInit = {
			method: 'GET',
			headers: userReqHeaders
		};

		const usersResponse = await fetch(`/`, userReqInit);
		if (!usersResponse.ok) {
			return {
				status: 401,
				body: {
					message: 'Total user fetch failed'
				}
			};
		}

		const users = await usersResponse.json();
		return users;
	};
	const toggleAuthForm = async () => {
		quickHide = true;
		selected = selected === authFlowOptions[0] ? authFlowOptions[1] : authFlowOptions[0];
	};
	let formSwitchText = 'Already have an account?';

	// $: browser && form, session.set({ ...form?.body?.user });
	$: data?.users?.length && userStore.set(data?.users);
	$: $platformSession?.currentUser?.username && browser && goto('/games');
	$: if (selected === authFlowOptions[0]) {
		formSwitchText = 'Already have an account?';
	} else if (selected === authFlowOptions[1]) {
		formSwitchText = "Don't have an account?";
	}
	$: formSwitchAction = selected === authFlowOptions[0] ? 'Sign In' : 'Sign Up';
	$: quickHide && setTimeout(() => (quickHide = false), 1000);
	$: isMobile = pageWidth <= 768;

	let centerLeftWidth;
	let centerRightWidth;
	let rightWidth;
	let leftWidth;

	// xDistanceStore is used to modify specific styles for the Logo component
	setContext('authPageStyleValues', {
		xDistanceStore: writable(null),
		showAuth: writable(false)
	});
	const { xDistanceStore, showAuth } = getContext('authPageStyleValues');
	$: $xDistanceStore = centerRightWidth;

	afterUpdate(() => {
		if ($showAuth === false && previousShowAuthVal === true) {
			if (!lockXDistance) {
				lockedWidth = centerRightWidth;
				lockedRightWidth = rightWidth;
				lockXDistance = true;
			}

			setTimeout(() => {
				previousShowAuthVal = false;
				centerLeftWidth = null;
				centerRightWidth = null;
				rightWidth = null;
			}, 1000);
		}

		if ($showAuth === true && previousShowAuthVal === true) {
			if (lockXDistance) {
				lockXDistance = false;
				lockedWidth = 0;
				lockedRightWidth = 0;
			}

			setTimeout(() => {
				previousShowAuthVal = true;
			}, 1000);
		}
	});
	$: $authWidthStore = centerRightWidth + rightWidth;

	onDestroy(() => {
		$authWidthStore = null;
		$stackTimeout = 4000;
	});
</script>

<div
	class="main"
	style="--svg-bg: url('{Frame}');"
	class:sideBarOpen={$sideBarState}
	bind:clientWidth={pageWidth}
>
	<div
		class="left"
		class:fullWidth={!$showAuth}
		style="--xDistance: {$xDistanceStore}px;"
		bind:clientWidth={leftWidth}
	>
		<div class="example-container">
			<ResponsiveLogo size={'xs'} />
			<div class="page-contents">
				<section class="heroSection">
					<div class="textCTA">
						<h1>Discover, Create, and Play Games Like Never Before.</h1>
						<p>Join a community of creators and gamers. Endless possibilities await.</p>
						<Button
							action={() => {
								previousShowAuthVal = $showAuth;
								$showAuth = !$showAuth;
							}}
							label={'Sign Up/In'}
							style={'background-color: #4da5ff; color: white; border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: 57.5px; max-height: unset; width: 50%; max-width: 210px;'}
						/>
					</div>
					<MockSlider />
				</section>
				<!-- <hr class="divider" />
				<section class="engineSection">
					<h1>Introducing the Engine Editor</h1>
					<p class="small">
						Unleash your creativity in the Engine. Build games using HTML, CSS, and JS. Modify code
						live and see the changes instantly.
					</p>
					<MockEditor />
				</section> -->
				<hr class="divider" />
				<section class="exploreSection">
					<div class="textCTA">
						<h1>Explore</h1>
						<p class="small">
							See what Play Engine has to offer. Discover games created by the community.
						</p>
						<Button
							action={() => {
								goto('/games');
							}}
							label={'Continue To Games'}
							style={'background-color: #4da5ff; color: white; border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: 57.5px; max-height: unset; width: 50%; max-width: 210px;'}
						/>
						<HorizontalList
							title={'Categories'}
							type={'categories'}
							link={'/games'}
							viewMoreLabel={'All Games & Categories'}
							showViewMore={true}
						/>
					</div>
				</section>
			</div>
		</div>
	</div>
	{#if $showAuth || (centerLeftWidth === undefined && centerRightWidth === undefined)}
		<div
			class="center-left"
			class:hidden={!$showAuth}
			bind:clientWidth={centerLeftWidth}
			in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
			out:slide={{ delay: 0, duration: 250, easing: quintOut, axis: 'x' }}
		>
			<div class="left-cover">
				{#if centerLeftWidth}
					<div
						class="left-clip-top"
						style="height: calc(100% - {centerLeftWidth ?? 0}px) !important;"
					/>
					<div
						class="left-clip-bottom"
						style="height: {centerLeftWidth ?? 0}px; width: cacl({centerLeftWidth ??
							0}px + 1px); border-bottom-right-radius: calc({centerRightWidth}px / 1.5);"
					/>
				{/if}
			</div>
		</div>
		<div
			class="center-right"
			class:hidden={!$showAuth}
			bind:clientWidth={centerRightWidth}
			class:lockedWidth={lockXDistance}
			in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
			out:slide={{ delay: 0, duration: 250, easing: quintOut, axis: 'x' }}
			style="--lockedWidth: {lockedWidth}px;"
		>
			{#if centerRightWidth}
				<div class="right-cover">
					<div
						class="right-clip-top"
						style="height: {centerRightWidth ?? 0}px; width: calc({centerRightWidth ??
							0}px + 1px); border-top-left-radius: calc({centerRightWidth}px / 1.5);"
					/>
					<div
						class="right-clip-bottom"
						style="height: calc(100% - {centerRightWidth ?? 0}px) !important;"
					/>
				</div>
			{/if}
		</div>
		<div
			class="right auth"
			class:lockedRightWidth={lockXDistance}
			style="--xDistance: {$xDistanceStore}px; --lockedRightWidth: {lockedRightWidth}px;"
			in:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}
			out:slide={{ delay: 0, duration: 250, easing: quintOut, axis: 'x' }}
			bind:clientWidth={rightWidth}
		>
			<div
				class:hide={isMobile}
				in:fade={{ delay: 750, duration: 600 }}
				out:fade={{ duration: 10 }}
			>
				<Logo xDistance={$xDistanceStore} />
			</div>
			<button
				class="close"
				on:click={() => {
					$showAuth = false;
					centerRightWidth = null;
				}}>Close</button
			>

			<div
				class="auth-container"
				in:fade={{ delay: 750, duration: 600 }}
				out:fade={{ duration: 10 }}
			>
				<div class="authentication" class:quickHide>
					<div class="form-container" class:isSignIn={selected === authFlowOptions[1]}>
						<div class="flexed-form" class:sideBarOpen={$sideBarState}>
							<svelte:component this={selected.component} />
							{#if selected === authFlowOptions[1]}
								<div class="form-action under">
									<span>Forgot Password?</span>
									<Button
										action={() => {
											selected = authFlowOptions[2];
										}}
										label={'Request reset'}
										style={'background-color: transparent !important; color: #4da5ff !important; text-decoration: underline; font-size: 0.9rem;'}
									/>
								</div>
							{/if}
							{#if selected !== authFlowOptions[2]}
								<div class="form-action under">
									<span>{formSwitchText}</span>
									<Button
										action={toggleAuthForm}
										label={formSwitchAction}
										style={'background-color: transparent !important; color: #4da5ff !important; text-decoration: underline; font-size: 0.9rem;'}
									/>
								</div>
							{/if}
							{#if selected === authFlowOptions[2]}
								<div class="form-action">
									<Button
										action={() => {
											selected = authFlowOptions[1];
										}}
										label={'Back to Sign In'}
										style={'background-color: transparent !important; color: #4da5ff !important; text-decoration: underline; font-size: 0.9rem;'}
									/>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		height: 100vh;
		width: 100vw;
		margin: 0;
	}
	.main {
		height: calc(100%);
		width: calc(100%);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/* background-image: var(--svg-bg);
		background-repeat: repeat;
		background-size: 50%; */
		/* background-color: #2e324c; */
		/* border: 8px solid #fff9d7;
		border-left: 0;
		border-top: 0;
		border-top-right-radius: 55px; */

		height: calc(100%);
		width: calc(100%);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.main.sideBarOpen {
		width: calc(100% - 230px);
	}
	:global(#split-output) {
		height: 100%;
	}
	:global(.monaco-editor) {
		border-radius: 8px;
	}
	:global(.monaco-editor .overflow-guard) {
		border-radius: 6px !important;
	}
	:global(.margin-view-overlays) {
		background-color: transparent;
	}
	:global(.view-lines) {
		background-color: transparent;
	}
	:global(.section-panel) {
		flex-grow: 1;
	}
	.auth-container {
		/* flex-grow: 1; */
		/* position: relative; */
		/* top: -77px; */
		/* display: flex; */
		/* justify-content: center; */
		/* align-items: center; */
		/* padding-top: 56.5px; */

		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		top: -57px;
		width: 50%;
		height: 112%;
		background-color: #2e324c;
	}
	.hero {
		width: 39%;
		height: 25%;
		position: absolute;
		top: 0;
		/* left: 20px; */
		z-index: 1;
		display: none;
	}
	.hero svg {
		width: 100%;
		height: 100%;
		/* left: 7.335px; */
		position: relative;
	}

	:global(.showSideBar) .hero,
	:global(.showSideBar) .auth-container {
		/* right: 115px; */
		/* left: unset; */
	}
	.form-container {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		justify-content: center;

		/* background-color: #fff9d7;
		border-radius: 60px;
		padding: 8px;
		transition: all 0.5s linear; */
	}
	.form-container {
		/* width: 613px; */
	}
	:global(form h1) {
		font-family: 'Rubik', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: #2e324c;
		margin-block-start: 1.5rem;
	}
	.form-action {
		display: flex;
		padding: 10px;
		align-items: center;
		gap: 0px;
		margin-top: 5px;
	}
	.form-action span {
		font-family: 'Nunito', sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		color: #2b2b2cba;
	}
	.auth-container {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		bottom: 7vh;
	}
	@media (max-width: 768px) {
		.form-container {
			width: 100%;
			height: 100%;
		}
	}

	@keyframes clockwise {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes counter-clockwise {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
	.gPath {
		transition: animation 0.5s linear;
		animation: clockwise 10s infinite linear;
		transform-origin: 2746.21px 607.41px;
		x: 10%;
	}
	/* .gPath:hover {
		animation: counter-clockwise 10s infinite linear;
	} */
	.flexed-form {
		width: 60%;
		height: 100%;
		display: flex;
		flex-direction: column;
		/* gap: 20px; */
		/* padding: 10% 40%; */
		top: calc(var(--xDistance) + (var(--xDistance) / 2));
		position: relative;
	}
	.flexed-form.sideBarOpen {
		/* padding: 10% 40%; */
	}
	.authentication {
		/* transition: opacity 5ms linear; */
		height: 100%;
		width: 100%;
	}
	.authentication.quickHide {
		/* opacity: 0; */
	}
	.horizontal-slider {
		height: 100%;
		width: 100%;
		background: red;
		z-index: 10000;
		position: relative;
		display: flex;
	}
	.slide {
		width: 100%;
		height: 100%;
		overflow-x: scroll;
		scroll-snap-align: center;
		position: absolute;
	}
	@media (max-width: 768px) {
		.form-container {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
		}
		:global(.email-username) {
			gap: 30px !important;
			flex-direction: column !important;
		}
		.flexed-form {
			padding: 0;
			width: 80%;
		}
	}
	@media (max-width: 498px) {
		.auth-container {
			top: unset;
			bottom: unset;
		}
		.hero {
			width: 78%;
			height: 30%;
			position: absolute;
			top: 0;
			left: 53px;
			z-index: 1;
			display: none;
		}
		.authentication {
			max-height: unset;
		}
		.form-container {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
		}
		.flexed-form {
			width: 80%;
			padding: 0;
			/* top: 100px; */
			/* height: 100%;
			display: flex;
			flex-direction: column;
			gap: 20px; */
			/* padding-top: 85%;
			padding: 90% 0 0 0; */
		}
		:global(.email-username) {
			gap: 10px !important;
			flex-direction: column !important;
		}
	}

	/* Main bg/layout */
	.container {
		display: flex;
		height: 100%;
		width: 100%;
	}

	.left {
		background-color: var(--color-secondary); /* Purple color */
		width: 40%;
		height: 100%;
	}

	.right {
		background-color: white;
		width: 40%;
		height: 100%;
		position: relative;
	}
	.center-left {
		background-color: white;
		flex-grow: 1;
		height: 100%;
		width: 10%;
	}
	.center-right {
		background-color: var(--color-secondary);
		flex-grow: 1;
		height: 100%;
		width: 10%;
	}
	.center-right.lockedWidth {
		min-width: var(--lockedWidth);
	}
	.left-cover {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: white;
	}
	.right-cover {
		width: 100%;
		height: 100%;
		position: relative;
		flex-direction: column;
		background-color: var(--color-secondary);
	}
	.left-clip-top {
		background-color: var(--color-secondary);
		height: 80%;
		width: 100%;
		bottom: 0;
	}
	.left-clip-bottom {
		/* background-color: white; */
		background-color: var(--color-secondary);
		flex-grow: 1;
		/* height: 20%; */
		/* mask: radial-gradient(farthest-side at top left, transparent 100%, #fff 100%); */
	}
	.right-clip-top {
		/* background-color: #2e324c; */
		flex-grow: 1;
		height: 20%;
		background-color: #ffffff;
		border-top-left-radius: 56px;
		/* mask: radial-gradient(farthest-side at bottom right, transparent 100%, #fff 100%); */
	}
	.right-clip-bottom {
		background-color: white;
		height: 80%;
		width: 100%;
		bottom: 0;
	}
	.example-container {
		width: calc(100%);
		height: calc(100%);
		/* margin: 20px; */
		border-radius: 15px;
		/* background-color: red; */
		overflow-x: hidden;
		overflow-y: auto;
		/* background-image: var(--svg-bg); */
	}
	.auth-container {
		width: calc(100% + var(--xDistance) - 40px);
		height: calc(100% - 40px);
		position: relative;
		left: calc(-1 * var(--xDistance));
		top: 0;
		margin: 20px;
		border-radius: 15px;
		background-color: unset;
	}
	.right div.close {
		display: none;
	}

	button.close {
		background-color: transparent;
		position: absolute;
		top: 25px;
		right: 20px;
		border: none;
		font-size: 4vmin;
		font-family: 'Source Sans 3', sans-serif;
		font-weight: 650;
		color: var(--vibrant-blue);
		display: none;
		z-index: 10000;
	}

	@media (max-width: 768px) {
		.left {
			/* display: none; */
		}
		button.close {
			display: block;
		}
		.right {
			width: 100% !important;
			display: flex;
			justify-content: center;
			position: absolute;
			z-index: 1000;
			top: 0;
			left: 0;
			overflow-y: scroll;
			overflow-x: hidden;
		}
		.right div.close {
			display: block;
		}
		.right :global(.logo-container) {
			margin-top: calc(var(--xDistance) / 2);
			left: calc(50% - 45px) !important;
			/* top: unset !important; */
		}
		.center-left {
			display: none;
		}
		.center-right {
			display: none;
		}
		.left-cover {
			display: none;
		}
		.right-cover {
			display: none;
		}
		.left-clip-top {
			display: none;
		}
		.left-clip-bottom {
			display: none;
		}
		.right-clip-top {
			display: none;
		}
		.right-clip-bottom {
			display: none;
		}
	}
	.left.fullWidth {
		width: 100%;
	}

	section p {
		font-family: 'Source Sans 3', sans-serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
		font-size: 2.5vmax;
		color: var(--color-primary);
		width: 80%;
		margin-inline-start: 0;
	}
	.heroSection {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		align-items: end;
		height: 100%;
		justify-items: center;
		margin-block-end: 10%;
	}
	.heroSection h1 {
		font-family: 'Source Sans 3', sans-serif;
		font-optical-sizing: auto;
		font-weight: 700;
		font-style: normal;
		font-size: 4vmax;
		color: var(--color-primary);
		width: 100%;
		margin-top: 10%;
		margin-block-end: 0;
	}
	.heroSection p {
		width: 100%;
	}
	.right.auth :global(.logo-container),
	.right.auth :global(.auth-container) {
		/* transition: opacity 0.15s linear; */
	}
	.right.auth.hidden :global(.logo-container),
	.right.auth.hidden :global(.auth-container) {
		opacity: 0;
	}
	/* div.removed {
		display: none;
	} */
	.left :global(div.authBtn) {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	/* :global(div.authBtn) :global(button.authBtn) {
		border-radius: 6px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		height: 57.5px;
		max-height: unset;
	} */
	.right.lockedRightWidth {
		width: var(--lockedRightWidth);
	}

	/* Editor Section */
	.engineSection {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10%;
	}

	section p.small {
		font-size: 1.5rem;
		/* margin-top: 20px; */
		margin-block-end: 20px;
	}

	.engineSection p {
		margin-block-end: 0;
		margin-block-start: 0;
	}
	hr.divider {
		margin-block-start: 3vmin;
		width: 95%;
		margin-block-end: 3vmin;
		border-radius: 6px;
		border: 0;
		height: 4px;
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #4ca5ff08, rgba(0, 0, 0, 0));
	}
	.textCTA {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: baseline;
		width: 80%;
	}
	.exploreSection {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10%;
	}
	h1 {
		font-family: 'Source Sans 3', sans-serif;
		font-optical-sizing: auto;
		font-weight: 700;
		font-style: normal;
		font-size: 4vmax;
		color: var(--color-primary);
		/* width: 100%; */
		/* margin-top: 10%; */
		margin-block-end: 0;
	}
	.engineSection h1 {
		width: 80%;
		margin-block-start: 0;
	}
	div.hide {
		display: none;
	}
	.form-action.under {
		padding: 0 10px;
	}
	:global(.authentication .flexed-form form) {
		height: fit-content !important;
		padding-bottom: 10px;
	}
</style>
