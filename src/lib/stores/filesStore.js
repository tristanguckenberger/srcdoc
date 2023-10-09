// import persistable from './persistable';
import { writable } from 'svelte/store';

export const fileSystemExpanderStore = writable({});
export const fileSystemMetaDataStore = writable({
	gameId: null,
	userId: null
});

// The file that is currently focused, nullable
export const focusedFileId = writable(null);

// The file that is currently soft selected, nullable
export const softSelectedFileId = writable(null);

// All files that are currently open (tabbed), nullable,
// file is added when a soft selection is made and then
// the tab or file is dbclicked
export const openFiles = writable([]);
