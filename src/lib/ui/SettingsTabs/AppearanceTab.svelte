<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Appearance</h1>
<p>Tweak the appearance of Play Engine</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
