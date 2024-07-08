<script>
	// @ts-nocheck
	import VerificationCodeInput from '../Input/VerificationCodeInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let updating = false;
</script>

<form
	action="?/verify"
	method="POST"
	use:enhance={async () => {
		updating = true;

		return async ({ update, result, action }) => {
			if (result?.status === 200) {
				await update();

				setTimeout(async () => {
					updating = false;
					await goto('/games');
				}, 500);
			}
		};
	}}
>
	<VerificationCodeInput>
		<span slot="label" class="input-label">Verfication Code</span>
		<div slot="icon" class="input-icon">
			{@html $icons.password}
		</div>
	</VerificationCodeInput>
	<Button bind:creating={updating} label="Verify Me" isRounded />
</form>

<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
	@media (max-width: 498px) {
		form {
			height: unset;
		}
	}
</style>
