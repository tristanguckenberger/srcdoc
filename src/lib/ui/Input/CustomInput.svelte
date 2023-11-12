<script>
	export let inputText = '';
	export let blurAction = () => {};
</script>

<input
	type="text"
	bind:value={inputText}
	on:blur={() => {
		blurAction();
	}}
/>

<style>
	input {
		border: none;
		border-bottom: 1px solid #ccc;
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
	}
</style>
