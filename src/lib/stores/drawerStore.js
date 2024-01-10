import { writable } from 'svelte/store';

export const drawerOpen = writable(false);
export const selectedOption = writable(0);
export const screenHeight = writable(0);
