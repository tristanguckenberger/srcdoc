<script>
	// @ts-nocheck
	import { loginRequestPassword, registerRequestPassword } from '$lib/stores/authStore';

	export let formType = 'login';
	export let blurAction = () => {};

	let inputText = '';
	$: loginRequestPassword.set(inputText);
	$: registerRequestPassword.set(inputText);
</script>

<div class="input-container">
	<slot name="label" />
	<div class="row">
		<!-- <slot name="icon" /> -->
		<input
			type="password"
			name="password"
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
		border: 2px solid var(--vibrant-blue);
		padding: 1px;
		margin-top: 4px;
	}
	:global(.input-label) {
		font-weight: 200 !important;
		font-size: 1rem !important;
		font-family: var(--header-font), sans-serif !important;
		color: var(--vibrant-blue) !important;
		margin-left: 10px !important;
		padding: 0 2px !important;
		position: relative !important;
		top: 15px !important;
		background: #ffffff !important;
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		flex-grow: 1;
		padding: 15px;
		font-family: var(--paragraph-font), sans-serif;
		color: var(--darker-bg);
	}
	input:focus:not(.focus-visible) {
		outline: none;
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
