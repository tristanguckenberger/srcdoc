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

	let boundInputHeight = writable(0);
</script>

<h1>Sign up</h1>
<form action="?/register" method="POST">
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
			<span slot="label" class="input-label">Email*</span>
			<div slot="icon" class="input-icon">
				{@html $icons.email}
			</div>
		</EmailInput>
		<UsernameInput formType={'register'}>
			<span slot="label" class="input-label">Username*</span>
			<div slot="icon" class="input-icon">
				{@html $icons.username}
			</div>
		</UsernameInput>
	</div>
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
	<Button
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
		/* gap: 30px; */
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
		/* gap: 20px; */
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
