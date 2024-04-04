<script>
	// @ts-nocheck
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
</script>

<form action="?/login" method="POST">
	<EmailInput formType={'login'}>
		<span slot="label" class="input-label">Email</span>
		<div slot="icon" class="input-icon">
			{@html $icons.email}
		</div>
	</EmailInput>
	<PasswordInput formType={'login'}>
		<span slot="label" class="input-label">Password</span>
		<div slot="icon" class="input-icon">
			{@html $icons.password}
		</div>
	</PasswordInput>
	<Button label="Sign In" isRounded />
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
		gap: 30px;
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
</style>
