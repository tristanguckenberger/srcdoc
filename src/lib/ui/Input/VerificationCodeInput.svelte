<script>
	// @ts-nocheck
	import { verifactionRequestCode } from '$lib/stores/authStore';

	let inputText = '';
	$: verifactionRequestCode.set(inputText);
	export let blurAction = () => {};
</script>

<div class="input-container">
	<slot name="label" />
	<div class="row">
		<slot name="icon" />
		<input
			type="text"
			name="verificationCode"
			bind:value={inputText}
			on:blur={() => {
				blurAction();
			}}
		/>
	</div>
</div>

<style>
	.input-container {
		display: column;
		flex-direction: row;
	}
	.row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		border-radius: 4px;
		background-color: var(--input-bg);
		padding: 1px;
		margin-top: 4px;
	}
	:global(.input-label) {
		font-weight: 500;
		font-size: 1rem;
		font-family: var(--header-font), sans-serif;
		color: var(--color-primary);
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		flex-grow: 1;
		padding: 5px;
		font-family: var(--paragraph-font), sans-serif;
		color: var(--darker-bg);
	}
	input:focus-visible {
		outline: var(--vibrant-orange) auto 1px;
	}
	:global(.input-icon) {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(.input-icon svg) {
		width: 24px;
		height: 24px;
		fill: #dedbd7;
	}
</style>
