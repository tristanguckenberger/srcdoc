<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Activity & Data</h1>
<p>Manage your activity and Data</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
