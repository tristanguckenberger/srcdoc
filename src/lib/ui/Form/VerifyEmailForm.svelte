<script>
	// @ts-nocheck
	import VerificationCodeInput from '../Input/VerificationCodeInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { writable } from 'svelte/store';
	import { icons } from '$lib/stores/themeStore.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let boundInputHeight = writable(0);
	let updating = $state(false);
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
>	<div bind:clientHeight={$boundInputHeight}>
		<VerificationCodeInput>
			{#snippet label()}
						<span  class="input-label">Verfication Token</span>
					{/snippet}
			<!-- <div slot="icon" class="input-icon">
				{@html $icons.password}
			</div> -->
		</VerificationCodeInput>
	</div>
	<Button bind:creating={updating} label="Continue" style="border-radius: 6px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px; height: {$boundInputHeight -
			24.5}px; max-height: unset;" />
</form>

<style>
	form {
		width: 50vmax;
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
