<script>
	// @ts-nocheck
	export let action;
</script>

<div class="form-container">
	<form on:submit|preventDefault={action}>
		<slot />
	</form>
</div>

<style>
	.form-container {
		display: flex;
		width: 400px;
		background-color: #e7e4df75;
		border-radius: 8px;
		padding: 10px;
	}

	form {
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		border-radius: 8px;
		background-color: #dedbd757;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 25px 80px 100px 80px;
	}
	:global(form h1) {
		font-family: 'Rubik', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: #2e324c;
		margin-block-start: 1.5rem;
	}
</style>
