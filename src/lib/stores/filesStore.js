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

// The width of the file system sidebar
export const fileSystemSidebarWidth = writable(300);

// If the file system sidebar is open
export const fileSystemSidebarOpen = writable(true);

// Track current code panes
export const codePanes = writable(['#split-html', '#split-css', '#split-js']);
