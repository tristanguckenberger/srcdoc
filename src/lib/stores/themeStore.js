// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

const lightTheme = readable([
	'--color-primary: #000;',
	'--color-secondary: #FBFBFB;',
	'--text-color-highlight: #000;',
	'--text-color-primary: #121212;',
	'--folder-button-color: #424242;',
	'--color-highlight-faded: rgba(0, 0, 0, 0.06);'
]);

const darkTheme = readable([
	'--color-primary: #fff;',
	'--color-secondary: #373638;',
	'--text-color-highlight: #ffffff;',
	'--text-color-primary: #fbfbfb;',
	'--folder-button-color: #cccccc;',
	'--color-highlight-faded: rgba(0, 0, 0, 0.1);'
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
