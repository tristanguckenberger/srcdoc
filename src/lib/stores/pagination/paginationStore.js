import { writable, derived } from 'svelte/store';

// Initialize cursor store
export const cursorStore = writable({
	current: 0,
	next: 0
});

// derived store to reset the cursor if current === next
export const processedCursor = derived(cursorStore, ($cursor) => {
	console.log('derived::processedCursor::', $cursor);
	// if ($cursor?.current === $cursor?.next && $cursor?.current !== 0) {
	// 	cursorStore.update((cursor) => {
	// 		cursor.current = 0;
	// 		cursor.next = 0;
	// 		return cursor;
	// 	});
	// } else {
	return $cursor;
	// }
});
