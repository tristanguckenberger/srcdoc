/**
 *
 * @title Persistable Store
 * @description A store that persists to localStorage or cookie
 *
 * Usage
 * const count = persist('count', 'localStorage');
 *
 * To set a value
 * count.set(1);
 *
 * To update a value
 * count.update(n => n + 1);
 *
 * To clear the store and wipe localStorage or cookie
 * count.clear();
 *
 *
 */
// @ts-nocheck

// import { writable } from 'svelte/store';

// const isBrowser = typeof window !== 'undefined';

// const persistable = (key, storageType = 'localStorage', start) => {
// 	// Initialize value from storage
// 	let initialValue;
// 	// Initialize value from storage only if in a browser environment
// 	if (isBrowser) {
// 		if (storageType === 'localStorage') {
// 			initialValue = localStorage?.getItem(key);
// 		} else if (storageType === 'cookie') {
// 			const match = document?.cookie?.match(new RegExp('(^| )' + key + '=([^;]+)'));
// 			initialValue = match ? match[2] : undefined;
// 		}
// 	}

// 	// Convert the string value to JSON if possible
// 	try {
// 		initialValue = JSON.parse(initialValue);
// 	} catch (error) {
// 		// Do nothing, use as is
// 	}

// 	// Create the store
// 	const store = writable(initialValue, (set) => {
// 		if (typeof start === 'function') {
// 			return start(set);
// 		}
// 	});

// 	// Subscribe to changes
// 	store.subscribe((value) => {
// 		if (storageType === 'localStorage' && isBrowser) {
// 			localStorage?.setItem(key, JSON.stringify(value));
// 		} else if (storageType === 'cookie') {
// 			document.cookie = `${key}=${JSON.stringify(value)};path=/`;
// 		}
// 	});

// 	// Add a clear method to wipe storage
// 	store.clear = () => {
// 		store.set(undefined);
// 		if (storageType === 'localStorage' && isBrowser) {
// 			localStorage?.removeItem(key);
// 		} else if (storageType === 'cookie') {
// 			document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
// 		}
// 	};

// 	return store;
// };

import { writable } from 'svelte/store';

export function persistable(data) {
	const store = writable(data);
	const { subscribe, set, update } = store;
	const isBrowser = typeof window !== 'undefined';

	isBrowser && localStorage.storable && set(JSON.parse(localStorage.storable));

	return {
		subscribe,
		set: (n) => {
			isBrowser && (localStorage.storable = JSON.stringify(n));
			set(n);
		},
		update: (cb) => {
			const updatedStore = cb(this.get(store));

			isBrowser && (localStorage.storable = JSON.stringify(updatedStore));
			set(updatedStore);
		}
	};
}

export default persistable;
