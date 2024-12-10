<script>
	import TemplateTab from './TemplateTab.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [tab_form_elements]
	 */

	/** @type {Props} */
	let { tab_form_elements } = $props();
</script>

<h1>Privacy & Security</h1>
<p>Manage your Privacy & Security Preferences</p>
<TemplateTab>
	{#snippet form_elements()}
		<div >
			{@render tab_form_elements?.()}
		</div>
	{/snippet}
</TemplateTab>
