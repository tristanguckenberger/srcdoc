import { writable, derived } from 'svelte/store';

// Initialize cursor store
export const cursorStore = writable({
	current: 0,
	next: 0
});

// derived store to reset the cursor if current === next
export const processedCursor = derived(cursorStore, ($cursor) => {
	return $cursor;
});
