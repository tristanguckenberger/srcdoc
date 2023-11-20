// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

import { gridWidth } from './layoutStore';

export const icons = readable({
	email: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"></path></svg>`,
	password: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M48,56V200a12,12,0,0,1-24,0V56a12,12,0,0,1,24,0Zm82.73,50.7L116,111.48V96a12,12,0,0,0-24,0v15.48L77.27,106.7a12,12,0,1,0-7.41,22.82l14.72,4.79-9.1,12.52A12,12,0,1,0,94.9,160.94l9.1-12.52,9.1,12.52a12,12,0,1,0,19.42-14.11l-9.1-12.52,14.72-4.79a12,12,0,1,0-7.41-22.82Zm111.12,7.7a12,12,0,0,0-15.12-7.7L212,111.48V96a12,12,0,0,0-24,0v15.48l-14.73-4.78a12,12,0,1,0-7.41,22.82l14.72,4.79-9.1,12.52a12,12,0,1,0,19.42,14.11l9.1-12.52,9.1,12.52a12,12,0,1,0,19.42-14.11l-9.1-12.52,14.72-4.79A12,12,0,0,0,241.85,114.4Z"></path></svg>`
});

const baseTheme = readable([
	'--dark-green: #074F57;',
	'--vibrant-blue: #4CA5FF;',
	'--vibrant-orange: #F06449;',
	'--shallow-purple: #A67DB8;',
	'--off-deep-purple: #493843;',
	'--deep-purple: #4A244E;',
	'--dark-yellow: #D5A021;',
	'--deep-blue: #043757;',
	'--purple-main: #46255F;',
	'--green-main: #043C3F;',
	'--home-bg: #faf8f4;'
]);

const lightTheme = readable([
	'--color-primary: #2e324c;',
	'--color-secondary: #f6f6f6;',
	'--text-color-highlight: #000;',
	'--text-color-primary: #121212;',
	'--folder-button-color: #424242;',
	'--button-highlight: rgba(0, 0, 0, 0.06);',
	'--color-highlight-faded: rgba(0, 0, 0, 0.06);',
	'--color-accent: #1c6ef3;',
	'--darker-bg: #1c1d1f;',
	'--text-box: #ffffff;',
	'--text-box-outline: rgba(0, 0, 0, 0.06);'
]);

const darkTheme = readable([
	'--color-primary: #f6f6f6;',
	'--color-secondary: #202124;',
	'--text-color-highlight: #ffffff;',
	'--text-color-primary: #e8eaed;',
	'--button-highlight: rgb(44 44 44);',
	'--folder-button-color: #cccccc;',
	'--color-highlight-faded: rgba(0, 0, 0, 0.1);',
	'--color-accent: #4ca5ff;',
	'--darker-bg: #1c1d1f;',
	'--text-box: #1a1b1d;',
	'--text-box-outline: rgb(44 44 44);'
]);

const fontTheme = readable([
	'--action-font: Nunito, sans-serif;',
	'--header-font: Geologica, sans-serif;',
	'--paragraph-font: Nunito, sans-serif;',
	`--base-font-size: '14px';`
]);

// const baseTheme = readable(['--color-accent: #1c6ef3;']);

// Initial theme config from current state
export const themeKeyStore = writable('light');

export const themeDataStore = derived(
	[themeKeyStore, baseTheme, lightTheme, darkTheme, gridWidth, fontTheme],
	([$themeKeyStore, $baseTheme, $lightTheme, $darkTheme, $gridWidth, $fontTheme]) => {
		return {
			themeKey: $themeKeyStore,
			theme:
				$themeKeyStore === 'light'
					? [...$baseTheme, ...$lightTheme, ...$fontTheme, `--nav-width: ${$gridWidth}px;`]
					: [...$baseTheme, ...$darkTheme, ...$fontTheme, `--nav-width: ${$gridWidth}px;`]
		};
	}
);
