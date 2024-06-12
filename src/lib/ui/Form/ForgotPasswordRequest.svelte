<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';

	let boundInputHeight = writable(0);
	let creating = false;
	let message;

	onDestroy(() => {
		message = null;
	});
</script>

<h1 class="reset-header">{message ? message : "What's your email?"}</h1>
<form
	action="?/forgotPasswordRequest"
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
			}
		};
	}}
>
	{#if !message}
		<EmailInput formType={'login'}>
			<span slot="label" class="input-label">Email*</span>
			<div slot="icon" class="input-icon">
				{@html $icons.email}
			</div>
		</EmailInput>
		<Button
			bind:creating
			label="Continue"
			style="border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: {$boundInputHeight -
				24.5}px; max-height: unset;"
		/>
	{/if}
</form>

<style>
	.tagline {
		display: flex;
		flex-direction: column;
		gap: 30px;
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
</style>
