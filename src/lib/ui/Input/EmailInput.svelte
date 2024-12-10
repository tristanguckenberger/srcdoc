<script>
	import { run } from 'svelte/legacy';

	// @ts-nocheck
	import {
		loginRequestUsername,
		registerRequestEmail,
		registerRequest
	} from '$lib/stores/authStore';

	/**
	 * @typedef {Object} Props
	 * @property {string} [formType]
	 * @property {any} [blurAction]
	 * @property {import('svelte').Snippet} [label]
	 */

	/** @type {Props} */
	let { formType = 'login', blurAction = () => {}, label } = $props();

	let inputText = $state('');
	let labelFocused = $state(false);
	run(() => {
		loginRequestUsername.set(inputText);
	});
	run(() => {
		registerRequestEmail.set(inputText);
	});
	let emailIsValid = $derived(formType === 'login' || JSON.parse($registerRequest)?.emailAvailable);
</script>

<div class="input-container">
	<div class="label-container" class:labelFocused={labelFocused || inputText !== ''}>
		{@render label?.()}
	</div>
	<div class="row">
		<!-- <slot name="icon" /> -->
		<input
			class:not-available={!emailIsValid}
			type="email"
			name="email"
			bind:value={inputText}
			onblur={() => {
				blurAction();
			}}
			onfocusin={() => (labelFocused = true)}
			onfocusout={() => (labelFocused = false)}
		/>
	</div>
</div>

<style>
	.input-container {
		width: 100%;
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
		background: transparent !important;
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
	.not-available {
		border: 1px solid red;
	}
	div.label-container {
		position: relative;
		top: 15px !important;
		transition: top 0.3s cubic-bezier(1, 0.01, 0, 0.99);
	}
	div.label-container.labelFocused {
		top: -11px !important;
	}
</style>
