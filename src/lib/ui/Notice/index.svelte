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
		background-color: var(--color-primary-muted);
		color: var(--color-primary);
		width: 100%;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
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
