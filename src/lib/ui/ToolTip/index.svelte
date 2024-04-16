<script>
	export let text = '';
	export let position = 'top'; // top, bottom, left, right
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
		position: absolute;
		display: inline-block;
		background-color: var(--color-primary);
		color: var(--color-secondary);
		border-radius: 6px;
		z-index: 10;
		padding: 5px;
		font-size: 0.9rem;
		font-weight: 700;
		font-family: var(--paragraph-font);
		min-width: fit-content;
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
