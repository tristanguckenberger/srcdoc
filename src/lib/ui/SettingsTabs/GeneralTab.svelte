<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
