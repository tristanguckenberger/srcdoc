<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [form_elements]
	 */

	/** @type {Props} */
	let { form_elements } = $props();
	/*
	 * This is a svelte component that is used to create tabs for settings page
	 * It is used in the settings page to create tabs for different settings
	 *
	 *
	 * @slot - This is the default slot for the component
	 **/
</script>

<div class="formElementsContainer">
	{@render form_elements?.()}
</div>
