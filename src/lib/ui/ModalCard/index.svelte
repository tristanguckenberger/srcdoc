<script>
	// @ts-nocheck
	import ModalTimingIndicator from './ModalTimingIndicator.svelte';

	let { index, title, message } = $props();
</script>

<div class="modal-card">
	<h2>{title}</h2>
	<p>{message}</p>
	<!-- <span>Index: {index}</span> -->
	<ModalTimingIndicator currentIndex={index} />
</div>

<style>
	.modal-card {
		background-color: var(--search-result-card);
		border-radius: 6px;
		box-shadow: 0px 0px 10px 2px rgb(0 0 0 / 34%);
		padding: 1rem;
		color: var(--color-primary);
	}

	.modal-card h2 {
		margin-block-start: 0;
		margin-block-end: 0;
		font-family: var(--header-font);
		font-size: 1.2rem;
		font-weight: 500;
		color: var(--color-primary);
	}

	.modal-card p {
		margin-block-end: 0;
		font-family: 'Fira Code';
	}
</style>
