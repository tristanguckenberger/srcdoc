<script>
	// @ts-nocheck
	import VerificationCodeInput from '../Input/VerificationCodeInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { icons } from '$lib/stores/themeStore.js';
</script>

<form action="?/verify" method="POST">
	<VerificationCodeInput>
		<span slot="label" class="input-label">Verfication Code</span>
		<div slot="icon" class="input-icon">
			{@html $icons.password}
		</div>
	</VerificationCodeInput>
	<Button label="Verify Me" isRounded />
</form>

<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
</style>
