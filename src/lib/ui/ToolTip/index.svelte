<script>
	/**
	 * @name ToolTip
	 * @description Used to display a tooltip on the screen.
	 */

	export let text = '';
	export let position = 'top';
</script>

<div
	class="tooltip__container"
	class:left={position === 'left'}
	class:right={position === 'right'}
	class:top={position === 'top'}
	class:bottom={position === 'bottom'}
>
	<span>{text}</span>
</div>

<style>
	.tooltip__container {
		background-color: var(--color-primary);
		border-radius: 6px;
		color: var(--color-secondary);
		display: inline-block;
		font-family: var(--paragraph-font);
		font-size: 0.9rem;
		font-weight: 700;
		min-width: fit-content;
		padding: 5px;
		position: absolute;
		z-index: 10;
	}
	.tooltip__container.left {
		right: 50px;
	}

	.tooltip__container.right {
		right: 0;
	}

	.tooltip__container.top {
		top: 0;
	}

	.tooltip__container.bottom {
		bottom: -47px;
	}
</style>
