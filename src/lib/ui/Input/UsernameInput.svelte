<script>
	// @ts-nocheck
	import { registerRequestUsername, registerRequest } from '$lib/stores/authStore';

	export let formType = 'register';

	let inputText = '';
	$: registerRequestUsername.set(inputText);
	$: usernameIsValid = JSON.parse($registerRequest)?.usernameAvailable;

	export let blurAction = () => {};
</script>

<div class="input-container">
	<slot name="label" />
	<div class="row">
		<slot name="icon" />
		<input
			class:not-available={!usernameIsValid}
			type="text"
			name="username"
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
		background-color: #fffbe4;
		padding: 5px;
		margin-top: 4px;
	}
	:global(.input-label) {
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		font-size: 1rem;
		color: #fffbe4;
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		color: #2e324c;
		flex-grow: 1;
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
	.not-available {
		border: 1px solid red;
	}
</style>
