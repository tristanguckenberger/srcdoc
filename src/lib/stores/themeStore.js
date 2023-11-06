// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

const lightTheme = readable([
	'--color-primary: #000;',
	'--color-secondary: #FBFBFB;',
	'--text-color-highlight: #000;',
	'--text-color-primary: #121212;'
]);

const darkTheme = readable([
	'--color-primary: #fff;',
	'--color-secondary: #373638;',
	'--text-color-highlight: #ffffff;',
	'--text-color-primary: #fbfbfb;'
]);

// Initial theme config from current state
export const themeKeyStore = writable('light');

export const themeDataStore = derived(
	[themeKeyStore, lightTheme, darkTheme],
	([$themeKeyStore, $lightTheme, $darkTheme]) => {
		return {
			themeKey: $themeKeyStore,
			theme: $themeKeyStore === 'light' ? $lightTheme : $darkTheme
		};
	}
);
