<script>
	// @ts-nocheck
	import Button from '$lib/ui/Button/index.svelte';
	import { browser } from '$app/environment';
	import { session } from '$lib/stores/sessionStore.js';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/authStore.js';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { onMount, afterUpdate } from 'svelte';
	import playbg from '$lib/assets/playbg.svg';
	import bg from '$lib/assets/bg.svg';
	import Frame from '$lib/assets/Frame.svg';
	import VerifyEmailForm from '$lib/ui/Form/VerifyEmailForm.svelte';
	import { redirect } from '@sveltejs/kit';

	export let form;
	export let data;

	let quickHide = false;

	// sync the session store data from the server with the session store on the client
	$: browser && form, session.set(form?.body?.user);

	// sync the user store data from the server with the user store on the client
	$: data?.users?.length && userStore.set(data?.users);

	afterUpdate(async () => {
		if (data?.sessionData?.is_active) {
			throw redirect(307, '/games');
		}
	});

	$: quickHide && setTimeout(() => (quickHide = false), 1000);
</script>

<div class="main verify" style="--svg-bg: url('{Frame}');">
	<div class="auth-container">
		<div class="authentication" class:quickHide>
			<div class="form-container" class:isSignIn={true} class:showSideBar={$sideBarState}>
				<div class="flexed-form">
					<VerifyEmailForm />
				</div>
			</div>
		</div>
	</div>
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
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: calc(100%);
		width: calc(100%);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		bottom: 7vh;
	}
	.form-container {
		display: flex;
		width: fit-content;
		/* background-color: #fff9d7; */
		/* border-radius: 60px; */
		/* padding: 8px; */
		/* transition: all 0.5s linear; */
	}
	.form-container {
		justify-content: center;
		align-items: center;
	}
	:global(form h1) {
		font-family: 'Rubik', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: #2e324c;
		margin-block-start: 1.5rem;
	}
	.auth-container {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		bottom: 14vh;
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
	.flexed-form {
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		border-radius: 55px;
		/* background-color: #2e324c; */
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 92.58px 80px 25px 80px;
	}
	.authentication {
		width: 100%;
		height: 100%;
	}

	:global(body) {
		height: 100vh;
		width: 100vw;
		margin: 0;
	}
	.main {
		height: calc(100%);
		width: calc(100%);
		display: flex;
		flex-direction: column;
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
		width: calc(100%) !important;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
	.form-container {
		display: flex;
		width: 100%;
		box-sizing: border-box;

		/* background-color: #fff9d7;
		border-radius: 60px;
		padding: 8px;
		transition: all 0.5s linear; */
	}
	:global(form h1) {
		font-family: 'Rubik', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: #2e324c;
		margin-block-start: 1.5rem;
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
	.flexed-form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		/* padding: 10% 40%; */
		align-items: center;
		top: 350px;
		position: relative;
	}
	.authentication {
		/* transition: opacity 5ms linear; */
		max-height: 716.08px;
		width: 100%;
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

	.authentication {
		max-height: unset !important;
	}
	.form-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: var(--color-secondary);
	}

	.form-container.showSideBar {
		width: calc(100% - 230px);
	}

	@media (max-width: 498px) {
		.auth-container {
			top: unset;
			bottom: unset;
		}
		.authentication {
			max-height: unset !important;
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
			top: 100px;
			/* height: 100%;
			display: flex;
			flex-direction: column;
			gap: 20px; */
			/* padding-top: 85%;
			padding: 90% 0 0 0; */
		}
		:global(.email-username) {
			gap: 30px !important;
			flex-direction: column !important;
		}
	}
	:global(#editor-layout.verifyInRoute) {
		width: 100% !important;
		margin-left: 0 !important;

	}
	:global(#editor-layout.verifyInRoute) div.main.verify { 
		width: 100% !important;

	}

</style>
