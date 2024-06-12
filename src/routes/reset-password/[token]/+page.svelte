<script>
	import ResetPassword from '$lib/ui/Form/ResetPassword.svelte';
	export let data;

	$: console.log('data::', data);
</script>

<ResetPassword token={data?.token} />
