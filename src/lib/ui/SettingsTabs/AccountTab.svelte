<script>
	import TemplateTab from './TemplateTab.svelte';
</script>

<h1>Account</h1>
<p>Change your account settings</p>
<TemplateTab>
	<div slot="form_elements">
		<slot name="tab_form_elements" />
	</div>
</TemplateTab>
