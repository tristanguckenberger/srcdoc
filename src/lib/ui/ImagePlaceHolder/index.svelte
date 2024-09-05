<script>
	const colors = ['#4ca5ff', '#074F57', '#F06449', '#D5A021', '#043757', '#A67DB8'];
	let randIndex = Math.floor(Math.random() * colors.length);
</script>

<div class="image-placeholder" style="--random-bg-color: {colors[randIndex]};" />

<style>
	.image-placeholder {
		width: 100%;
		height: 100%;
		background-color: var(--random-bg-color);
	}
</style>
