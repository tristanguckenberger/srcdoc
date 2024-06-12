<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Editor</h1>
<p>Change your editor settings</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
