// @ts-nocheck
// import persistable from './persistable';
import { writable, derived } from 'svelte/store';

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
export const fileSystemSidebarWidth = writable(200);

// If the file system sidebar is open
export const fileSystemSidebarOpen = writable(true);

// If the user selects "open in new pane" when right clicking a file
export const openInNewPane = writable(false);

// Track current code panes
export const codePanes = writable(['#split-html', '#split-css', '#split-js']); // one of ['#split-html', '#split-css', '#split-js'] depending on the file that's focused and it's file type

export const baseDataStore = writable([]);

export const codePanes2 = writable([]);

// derived code data store will be the single source of truth for the focused file in a code editor
// derived store for the focused file
export const derivedCodeData = derived(
	[focusedFileId, softSelectedFileId, openFiles, openInNewPane, codePanes2],
	([$focusedFileId, $softSelectedFileId, $openFiles, $openInNewPane, $codePanes2]) => {
		const focusedFile = $openFiles.find((file) => file.id === $focusedFileId);
		const codeData = {
			fileId: focusedFile?.id,
			fileName: focusedFile?.name,
			source: focusedFile?.content,
			type: focusedFile?.type,
			openInNewPane: $codePanes2?.length < 1 || ($codePanes2?.length <= 3 && $openInNewPane),
			softSelected: $softSelectedFileId === focusedFile?.id
		};
		return codeData;
	}
);

// derived store for update handling
export const derivedUpdateData = derived([baseDataStore, openFiles], ([$baseDataStore]) => {
	return openFiles.map((file) => {
		const baseFile = $baseDataStore.find((baseFile) => baseFile.id === file.id);

		if (baseFile?.content !== file.content) {
			openFiles.update((files) => {
				const update = {
					...file,
					canSave: true
				};
				return files.map((file) => (file.id === update.id ? update : file));
			});
		} else {
			openFiles.update((files) => {
				const update = {
					...file,
					canSave: false
				};
				return files.map((file) => (file.id === update.id ? update : file));
			});
		}

		const update = {
			id: file.id,
			name: file.name,
			type: file.type,
			content: file.content,
			parentFileId: file.parentFileId,
			gameId: file.gameId
		};
		return update;
	});
});

/**
 * Function to update the 'needsSave' flag for a specific file.
 * @param {string} fileId - The ID of the file.
 * @param {boolean} value - The value to set the 'needsSave' flag to.
 */
export function updateNeedsSave(fileId, value) {
	openFiles.update((files) => {
		return files.map((file) => {
			if (file.id === fileId) {
				return {
					...file,
					needsSave: value
				};
			}
			return file;
		});
	});
}

/**
 * Function to save a file and reset the 'needsSave' flag.
 * @param {string} fileId - The ID of the file to save.
 */
export function saveFile(fileId) {
	openFiles.update((files) => {
		return files.map((file) => {
			if (file.id === fileId) {
				// Update the relevant fields here as needed
				return {
					...file,
					needsSave: false // Reset the 'needsSave' flag
				};
			}
			return file;
		});
	});
}
