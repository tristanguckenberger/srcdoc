<script>
	// @ts-nocheck
	import { loginRequestUsername } from '$lib/stores/authStore';

	let inputText = 'tristan@gcans.com';
	$: loginRequestUsername.set(inputText);

	export let blurAction = () => {};
</script>

<div class="input-container">
	<slot name="label" />
	<div class="row">
		<slot name="icon" />
		<input
			type="email"
			name="email"
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
		background-color: #faf8f4;
		padding: 5px;
	}
	:global(.input-label) {
		font-family: 'Nunito', sans-serif;
		font-weight: 700;
		font-size: 1rem;
		color: #2e324c;
	}
	input {
		border: none;
		font-size: 1rem;
		background-color: transparent;
		color: #2e324c;
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
