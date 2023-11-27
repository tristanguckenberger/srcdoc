<script>
	//@ts-nocheck
	import Form from '$lib/ui/Form/index.svelte';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';

	let email = '';
	let password = '';

	const submit = (e) => {
		e.preventDefault();
	};
</script>

<div class="auth-container">
	<Form action={submit}>
		<CustomInput />
		<CustomInput />

		<button type="submit" slot="submit">Submit</button>
	</Form>
</div>
