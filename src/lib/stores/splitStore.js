import { writable } from 'svelte/store';

export const cleanGutters = writable(null);
export const isAddingPane = writable(true);
export const splitStore = writable(null);
export const editorSplitStore = writable(null);
export const clearSplit = writable(false);
export const splitInstanceStore = writable(null);
export const editorSplit = writable(null);
export const editorElement = writable(null);
export const guiEditorElement = writable(null);

export const gutterCount = writable(0);
export const paneManager = writable([]);
export const protectPaneManager = writable(false);
export const resetPanes = writable(false);
// export const paneManagerInstance = writable(null);
export const inputOutputContainerWidth = writable(0);
export const inputOutputContainerHeight = writable(0);

export const outputsContainerHeight = writable(0);
export const outputsContainerWidth = writable(0);
