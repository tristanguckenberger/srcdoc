<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { writable } from 'svelte/store';
	import { connectWebSocket } from '$lib/stores/websocketStore.js';
	import { enhance } from '$app/forms';

	let boundInputHeight = writable(0);
	let creating = false;
</script>

<h1>Welcome back</h1>
<form
	action="?/login"
	method="POST"
	use:enhance={() => {
		creating = true;

		return async ({ update, result }) => {
			console.log('login::result::', result?.data);
			connectWebSocket(result?.data?.body?.user?.id);

			await update();
			setTimeout(() => {
				creating = false;
			}, 500);
		};
	}}
>
	<EmailInput formType={'login'}>
		<span slot="label" class="input-label">Email*</span>
		<div slot="icon" class="input-icon">
			{@html $icons.email}
		</div>
	</EmailInput>
	<div bind:clientHeight={$boundInputHeight}>
		<PasswordInput formType={'login'}>
			<span slot="label" class="input-label">Password*</span>
			<div slot="icon" class="input-icon">
				{@html $icons.password}
			</div>
		</PasswordInput>
	</div>
	<Button
		bind:creating
		label="Continue"
		style="border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: {$boundInputHeight -
			24.5}px; max-height: unset;"
	/>
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
</style>
