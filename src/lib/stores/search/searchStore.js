import { writable, derived } from 'svelte/store';

export const searchQueryStore = writable('');
export const searchResultsStore = writable([]);
export const searchHasResultsStore = derived(searchResultsStore, ($searchResults) => {
	return $searchResults?.length > 0;
});

// Additional stores to handle the search states
export const searchIsLoadingStore = writable(false);
export const searchErrorStore = writable(null);
export const searchIsOpenStore = writable(false);
