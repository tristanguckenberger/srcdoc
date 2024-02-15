// @ts-nocheck
// import persistable from './persistable';
import { writable, derived } from 'svelte/store';

export const firstRun = writable(true);

export const fileSystemExpanderStore = writable({});
export const fileSystemVertTraceHighlightStore = writable({});
export const fileSystemMetaDataStore = writable({
	gameId: null,
	userId: null
});

// The file that is currently focused, nullable
export const focusedFileId = writable(null);

// The folder that is currently focused, nullable
export const focusedFolderId = writable(null);

export const fileStoreFiles = writable(null);

export const autoCompile = writable(false);

export const triggerCompile = writable(false);

// The file that was previously focused, nullable
export const previouslyFocusedFileId = writable(null);

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

// Initil data store for the file system, updates only when new data is fetched, i.e. after a save
export const initialDataStore = writable([]);

// Tracks the files that need to be updated or 'saved'
export const filesToUpdate = writable([]);

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
			parentFileId: file?.parentFileId ?? file?.parent_file_id,
			gameId: file.gameId ?? file.game_id
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

// creates new files or folders
export function createFile(fileName, parentFile, files, fileContent) {
	const type = fileName.split('.')[1];
	const name = fileName.split('.')[0];

	const newFile = {
		id: files?.length + 1,
		name,
		type: type ?? 'folder',
		content: fileContent ?? (type === 'folder' ? null : ''),
		gameId: parentFile?.gameId ?? parentFile?.game_id,
		parentFileId: parentFile?.id,
		createdAt: '',
		updatedAt: ''
	};

	fileStoreFiles.set([...files, newFile]);

	return newFile;
}

// Delete a file or folder
export function deleteFiles(targetId, files) {
	// Set to hold all ids that should be deleted
	const idsToDelete = new Set();

	// recursively find and mark files/folders for deletion
	function recursiveDelete(id) {
		idsToDelete?.add(id); // Mark the current id for deletion
		files?.forEach((file) => {
			if (file?.parentFileId === id ?? file?.parent_file_id === id) {
				// if it's child of the folder, mark its children for deletion as well
				recursiveDelete(file.id);
			}
		});
	}

	// Start the recursive delete
	recursiveDelete(targetId);

	// Now filter out the files that should be deleted
	const updatedFiles = files.filter((file) => !idsToDelete.has(file.id));

	// Update the Svelte store
	fileStoreFiles.set(updatedFiles);
}

export function renameFile(targetId, newName, newType, files) {
	const updatedFiles = files.map((file) => {
		if (file.id === targetId) {
			const gameId = file?.gameId ?? file?.game_id;
			const parentFileId = file?.parentFileId ?? file?.parent_file_id;

			// console.log('gameId at file update::', gameId);
			// console.log('parentFileId at file update::', parentFileId);

			return {
				...file,
				name: newName,
				type: newType,
				gameId,
				parentFileId
			};
		}

		return file;
	});

	fileStoreFiles.set(updatedFiles);
	return updatedFiles?.filter((file) => file?.id === targetId)[0];
}

export function uploadAndCompressAsset(file) {
	// Assume compress() is a function that takes a File and returns a compressed File
	const compressedFile = compress(file);
	return compressedFile;
}

// Dummy compression function (replace with actual logic)
function compress(file) {
	return file; // No actual compression here
}

export function toBlobURL(file) {
	const blob = new Blob([file], { type: file.type });
	const blobURL = URL.createObjectURL(blob);
	return blobURL;
}

export function storeFile(blobURL, fileType, parentFileId) {
	const id = Math.random(); // Generate a random ID; replace with your ID logic
	const newFile = {
		id,
		name: `asset-${id}`,
		type: fileType, // 'image' or 'audio'
		content: blobURL,
		gameId: 1, // Replace with actual gameId
		parentFileId,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	fileStoreFiles.update((allFiles) => {
		return [...allFiles, newFile];
	});
}

export const base64ToBlob = (base64Data) => {
	const fileData = base64Data.split(',');
	const contentType = fileData[0].split(':')[1].split(';')[0];
	const byteCharacters = atob(fileData[1]);

	let byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray], { type: contentType });
	const blobUrl = URL.createObjectURL(blob);
	return blobUrl;
};

// derived store for file system when in play mode
export const derivedFileSystemData = derived([baseDataStore], ([$baseDataStore]) => {
	fileStoreFiles.set($baseDataStore?.files);
	return $baseDataStore?.files;
});
