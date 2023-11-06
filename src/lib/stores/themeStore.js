// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

const lightTheme = readable({
	'--color-primary': '#000',
	'--color-secondary': '#FBFBFB'
});

const darkTheme = readable({
	'--color-primary': '#fff',
	'--color-secondary': '#373638'
});

// Initial theme config from current state
export const themeKeyStore = writable('light');

export const themeDataStore = derived(
	themeKeyStore,
	lightTheme,
	darkTheme,
	($themeKeyStore, $lightTheme, $darkTheme) => {
		return {
			themeKey: $themeKeyStore,
			theme: $themeKeyStore === 'light' ? $lightTheme : $darkTheme
		};
	}
);
