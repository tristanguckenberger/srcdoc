<script>
	import ResetPassword from '$lib/ui/Form/ResetPassword.svelte';
	export let data;
</script>

<ResetPassword token={data?.token} />
