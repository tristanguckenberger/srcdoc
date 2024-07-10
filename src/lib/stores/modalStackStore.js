// @ts-nocheck
import { writable, derived } from 'svelte/store';

export const itemsInStack = writable([]);

export const stackStyles = writable('');

export const stackTimeout = writable(4000);

// TODO: Create a derived store that automatically removes the oldest item from the stack when it reaches a certain length or when a certain amount of time has passed
export const autoStack = derived(itemsInStack, ($itemsInStack) => {
	if ($itemsInStack.length > 5) {
		// Dont use shift, we have to use slice to create a new array, and then set the $itemsInStack = newArray
		$itemsInStack = $itemsInStack.slice(1, $itemsInStack.length);
	}

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
			}, 5000);
		}
	});

	return $itemsInStack;
});
