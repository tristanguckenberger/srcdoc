<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import { redirect } from '@sveltejs/kit';
	import PasswordInputValidate from '../Input/PasswordInputValidate.svelte';
	import { sideBarState } from '$lib/stores/layoutStore';
	import CustomInput from '../Input/CustomInput.svelte';

	export let token;

	let boundInputHeight = writable(0);
	let creating = false;
	let message;
	let quickHide = false;

	$: quickHide && setTimeout(() => (quickHide = false), 1000);

	onDestroy(() => {
		message = null;
	});
</script>

<div class="auth-container" class:sideBarOpen={$sideBarState}>
	<div class="authentication" class:quickHide>
		<div class="form-container">
			<div class="flexed-form">
				<h1 class="reset-header">
					{message ? message + ' Redirecting to sign in...' : 'Enter you new password'}
				</h1>
				<form
					action="/?/resetPassword"
					method="POST"
					use:enhance={() => {
						creating = true;

						return async ({ update, result }) => {
							await update();
							setTimeout(() => {
								creating = false;
							}, 500);

							if (result) {
								console.log('result::', result);
								message = result?.data?.body?.message;
								setTimeout(() => {
									redirect(303, '/');
								}, 1000);
							}
						};
					}}
				>
					{#if !message}
						<div bind:clientHeight={$boundInputHeight}>
							<PasswordInput>
								<span slot="label" class="input-label">Password*</span>
								<div slot="icon" class="input-icon">
									{@html $icons.password}
								</div>
							</PasswordInput>
						</div>
						<PasswordInputValidate formType={'register'}>
							<span slot="label" class="input-label">Confirm Password*</span>
							<div slot="icon" class="input-icon">
								{@html $icons.password}
							</div>
						</PasswordInputValidate>
						<CustomInput inputCapture={'token'} inputText={token} hidden />
						<Button
							bind:creating
							label="Continue"
							style="border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: {$boundInputHeight -
								24.5}px; max-height: unset;"
						/>
					{/if}
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.auth-container.sideBarOpen {
		width: calc(100% - 230px);
	}
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	:global(form h1) {
		font-family: 'Rubik', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: #2e324c;
		margin-block-start: 1.5rem;
	}
	@media (max-width: 498px) {
		form {
			height: unset;
		}
	}
	h1 {
		font-size: 2.5em;
		text-align: center;
		margin-block-end: 0;
		font-family: 'Montserrat';
		font-weight: 550;
		color: #2e324c;
	}
	.reset-header {
		font-size: 1.5em;
		font-weight: 550;
		align-self: flex-start;
	}

	.form-container {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		justify-content: center;
	}

	h1 {
		font-family: 'Source Sans 3', sans-serif;
		font-optical-sizing: auto;
		font-weight: 700;
		font-style: normal;
		font-size: 4vmax;
		color: var(--color-primary);
		margin-block-end: 0;
	}
	.auth-container :global(input) {
		color: var(--color-primary);
	}
</style>
