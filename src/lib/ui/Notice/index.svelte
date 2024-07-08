<script>
	export let title = '';
	export let message = '';
</script>

<div class="notice-container">
	<h3 class="notice-header">{title}</h3>
	<p class="notice-message">{message}</p>
	<slot name="action" />
</div>

<style>
	.notice-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--color-primary);
		color: var(--color-white);
	}

	.notice-header {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		font-family: 'Source Sans 3', sans-serif;
	}

	.notice-message {
		font-size: 1rem;
		font-weight: 400;
		font-family: 'Source Sans 3', sans-serif;
	}
</style>
