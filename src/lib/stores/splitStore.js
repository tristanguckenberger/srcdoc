import { writable } from 'svelte/store';

export const splitStore = writable(null);
export const clearSplit = writable(false);
export const splitInstanceStore = writable(null);
export const editorSplit = writable(null);
export const editorElement = writable(null);
