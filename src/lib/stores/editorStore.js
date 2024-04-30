import { writable } from 'svelte/store';

export const editorStore = writable(null);

export const addPaddingToEditorStore = writable(false);
