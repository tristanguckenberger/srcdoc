<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import EmailInput from '$lib/ui/Input/EmailInput.svelte';
	import PasswordInput from '$lib/ui/Input/PasswordInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { enhance } from '$app/forms';

	const getCurrentUser = async () => {
		const userResponse = await fetch(`/api/users/getCurrentUser`);
		const user = await userResponse.json();

		return user;
	};
</script>

<!-- ADD THIS use:enhance for handling tokens with localstorage -->
<!-- use:enhance={({ formElement, formData, action, cancel, redirect }) => {
	return async ({ result }) => {
		if (result.status === 200) {
			if (browser) {
				console.log('result::', result?.data?.body?.user?.token);
				const token = result?.data?.body?.user?.token;
				if (token) {
					localStorage.setItem('token', token);
					// Redirect or update UI as necessary

					const user = await getCurrentUser(token);
					console.log('user::', user);
				}
			}
			// gameFavorites.set(result?.data?.body?.favorites);
			// gameFavoriteCount.set(result?.data?.body?.favorites?.length);
			// isFavorited = !isFavorited;
		}
	};
}} -->
<form action="?/login" method="POST">
	<!-- <div class="tagline">
		<Button label="Continue with Google" isRounded />
		<Button label="Continue with GitHub" isRounded />
		<div class="sign-in-split">
			<hr />
			<span>or continue with email</span>
			<hr />
		</div>
	</div> -->
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
