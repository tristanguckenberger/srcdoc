<script>
	let { panelTitle = '', panelType = '', projectOwnerId, panelHeaderButtons, children } = $props();
</script>

<div class="panel-info">
	<div class="panel-header">
		<div class="panel-title">{panelTitle}</div>
		<div
			class="panel-type
			{panelType === 'info' ? 'info' : ''}
			{panelType === 'warning' ? 'warning' : ''}
			{panelType === 'error' ? 'error' : ''}
		"
		>
			{panelType}
		</div>
		<div class="panel-header-buttons">
			{@render panelHeaderButtons?.()}
		</div>
	</div>
	<div class="additional-panel-content">{@render children?.()}</div>
</div>

<style>
	.panel-info {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.panel-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		height: 40px;
	}

	.panel-title {
		font-size: 1.25rem;
		font-weight: 500;
	}

	.panel-type {
		font-size: 1rem;
		font-weight: 500;
		padding: 0 8px;
		border-radius: 4px;
	}

	.info {
		background-color: var(--color-info);
		color: var(--color-info-text);
	}

	.warning {
		background-color: var(--color-warning);
		color: var(--color-warning-text);
	}

	.error {
		background-color: var(--color-error);
		color: var(--color-error-text);
	}

	.panel-header-buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.additional-panel-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 16px;
	}
</style>
