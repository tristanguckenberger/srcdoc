<script>
	import { itemsInStack, stackStyles, stackTimeout } from '$lib/stores/modalStackStore';
	import { page } from '$app/stores';
	import ModalCard from '$lib/ui/ModalCard/index.svelte';
	import { authWidthStore } from '$lib/stores/authStore';

	$: {
		if ($itemsInStack.length >= 5) {
			setTimeout(() => {
				itemsInStack.update((items) => items.slice(1));
			}, 1000);
		}
	}

	$: {
		$itemsInStack.forEach((item, index) => {
			console.log('Checking item', item, index);
			// check useTimeout boolean flag on each item
			if (item?.useTimeout) {
				// if true, set a timeout to remove the item from the stack
				setTimeout(() => {
					$itemsInStack = $itemsInStack.filter((_, i) => {
						console.log('Removing item from stack', _);
						return i !== index;
					});
					$stackStyles = '';
				}, $stackTimeout);
			}
		});
	}
	$: authFormWidth = $authWidthStore ? `width: ${$authWidthStore}px;` : '';
</script>

<div class="stack-container" style={`${authFormWidth}${$stackStyles}`}>
	{#each $itemsInStack as item, index (index)}
		<div class:authStatus={(item?.type === 'error' || item?.type === 'success') && $authWidthStore}>
			<ModalCard {index} title={item.title} message={item.message} />
		</div>
	{/each}
</div>

<style>
	.stack-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: absolute;
		z-index: 1000;
		bottom: 10px;
		right: 10px;
	}
	div.authStatus {
		position: absolute;
	}
</style>
