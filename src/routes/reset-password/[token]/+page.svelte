<script>
	import ResetPassword from '$lib/ui/Form/ResetPassword.svelte';
	let { data } = $props();
</script>

<ResetPassword token={data?.token} />
