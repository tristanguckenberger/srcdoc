<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Notifications</h1>
<p>Manage your Notification Preferences</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
