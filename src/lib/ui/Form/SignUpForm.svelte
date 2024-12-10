<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import UsernameInput from '../Input/UsernameInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import PasswordInputValidate from '../Input/PasswordInputValidate.svelte';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { platformSession } from '$lib/stores/platformSession';
	import { connectWebSocket } from '$lib/stores/websocketStore.js';
	import { browser } from '$app/environment';
	import { itemsInStack, stackStyles, stackTimeout } from '$lib/stores/modalStackStore';

	let boundInputHeight = writable(0);
	let creating = $state(false);
</script>

<h1>Sign Up</h1>
<form
	action="?/register"
	method="POST"
	use:enhance={() => {
		creating = true;

		return async ({ update, result }) => {
			if (
				result?.data?.status === 400 ||
				result?.data?.status === 401 ||
				result?.data?.status === 500
			) {
				$stackStyles = `top: 4rem; right: 0;`;
				$itemsInStack = [
					...$itemsInStack,
					{
						title: 'Registration Error',
						message: result?.data?.body?.message,
						useTimeout: true,
						type: 'error'
					}
				];

				creating = false;
				return;
			} else {
				$stackTimeout = 4000;
				$stackStyles = `top: 4rem; right: 0;`;
				$itemsInStack = [
					...$itemsInStack,
					{
						title: 'Registration Success',
						message:
							'You have successfully registered. Please check your email to verify your account.',
						useTimeout: true,
						type: 'success'
					}
				];

				setTimeout(async () => {
					if (browser) {
						platformSession?.set({
							currentUser: result?.data?.body?.user,
							settings: result?.data?.body?.settings,
							ready: true
						});
					}

					try {
						connectWebSocket(result?.data?.body?.user?.id);
					} catch (error) {
						console.error(error);
					}

					await update();
					setTimeout(() => {
						creating = false;
					}, 500);
				}, 2500);
			}
		};
	}}
>
	<!-- <div class="tagline">
		<Button label="Sign Up with Google" isRounded />
		<Button label="Sign Up with GitHub" isRounded />
		<div class="sign-in-split">
			<hr />
			<span>or continue with email</span>
			<hr />
		</div>
	</div> -->
	<div class="email-username">
		<EmailInput formType={'register'}>
			{#snippet label()}
						<span  class="input-label">Email*</span>
					{/snippet}
			{#snippet icon()}
						<div  class="input-icon">
					{@html $icons.email}
				</div>
					{/snippet}
		</EmailInput>
		<UsernameInput formType={'register'}>
			{#snippet label()}
						<span  class="input-label">Username*</span>
					{/snippet}
			{#snippet icon()}
						<div  class="input-icon">
					{@html $icons.username}
				</div>
					{/snippet}
		</UsernameInput>
	</div>
	<div bind:clientHeight={$boundInputHeight}>
		<PasswordInput>
			{#snippet label()}
						<span  class="input-label">Password*</span>
					{/snippet}
			{#snippet icon()}
						<div  class="input-icon">
					{@html $icons.password}
				</div>
					{/snippet}
		</PasswordInput>
	</div>
	<PasswordInputValidate formType={'register'}>
		{#snippet label()}
				<span  class="input-label">Confirm Password*</span>
			{/snippet}
		{#snippet icon()}
				<div  class="input-icon">
				{@html $icons.password}
			</div>
			{/snippet}
	</PasswordInputValidate>
	<Button
		bind:creating
		label="Continue"
		style={`border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: ${
			$boundInputHeight - 24.5
		}px; max-height: unset;`}
	/>
</form>

<style>
	.tagline {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
	.sign-in-split {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		gap: 20px;
		padding: 10px;
		box-sizing: border-box;
	}
	.sign-in-split span {
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		font-size: 0.9rem;
		color: #b0b7e182;
	}
	.sign-in-split hr {
		width: 25%;
		height: 2px;
		background-color: #707698;
		border: none;
		border-radius: 7px;
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
	.email-username {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
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
</style>
