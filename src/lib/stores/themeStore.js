// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

import { gridWidth } from './layoutStore';

const lightTheme = readable([
	'--color-primary: #000;',
	'--color-secondary: #FBFBFB;',
	'--text-color-highlight: #000;',
	'--text-color-primary: #121212;',
	'--folder-button-color: #424242;',
	'--button-highlight: rgba(0, 0, 0, 0.06);',
	'--color-highlight-faded: rgba(0, 0, 0, 0.06);',
	'--color-accent: #1c6ef3;'
]);

const darkTheme = readable([
	'--color-primary: #fff;',
	'--color-secondary: #202124;',
	'--text-color-highlight: #ffffff;',
	'--text-color-primary: #e8eaed;',
	'--button-highlight: rgb(55 54 56);',
	'--folder-button-color: #cccccc;',
	'--color-highlight-faded: rgba(0, 0, 0, 0.1);',
	'--color-accent: #4ca5ff;'
]);

const fontTheme = readable([
	'--action-font: Nunito, sans-serif;',
	'--header-font: Geologica, sans-serif;',
	'--paragraph-font: Nunito, sans-serif;'
]);

// const baseTheme = readable(['--color-accent: #1c6ef3;']);

// Initial theme config from current state
export const themeKeyStore = writable('light');

export const themeDataStore = derived(
	[themeKeyStore, lightTheme, darkTheme, gridWidth, fontTheme],
	([$themeKeyStore, $lightTheme, $darkTheme, $gridWidth, $fontTheme]) => {
		return {
			themeKey: $themeKeyStore,
			theme:
				$themeKeyStore === 'light'
					? [...$lightTheme, ...$fontTheme, `--nav-width: ${$gridWidth}px;`]
					: [...$darkTheme, ...$fontTheme, `--nav-width: ${$gridWidth}px;`]
		};
	}
);
