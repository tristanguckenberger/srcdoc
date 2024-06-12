<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Privacy & Security</h1>
<p>Manage your Privacy & Security Preferences</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
