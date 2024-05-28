// @ts-nocheck
import { writable, derived, readable } from 'svelte/store';

import { gridWidth } from './layoutStore';

export const icons = readable({
	email: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"></path></svg>`,
	username: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M144,108a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H156A12,12,0,0,1,144,108Zm12,52h32a12,12,0,0,0,0-24H156a12,12,0,0,0,0,24ZM236,56V200a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V56A20,20,0,0,1,40,36H216A20,20,0,0,1,236,56Zm-24,4H44V196H212ZM54.28,159.37A43.82,43.82,0,0,1,67.53,142a36,36,0,1,1,56.94,0,43.84,43.84,0,0,1,13.26,17.37,12,12,0,0,1-22.15,9.26C112.48,161.19,104.42,156,96,156s-16.47,5.2-19.59,12.63a12,12,0,1,1-22.13-9.26ZM84,120a12,12,0,1,0,12-12A12,12,0,0,0,84,120Z"></path></svg>`,
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
	'--home-bg: #faf8f4;',
	'--file-selected-bg: #2b2c2f96;',
	'--button-blue: #2b4a6b;'
]);

const lightTheme = readable([
	'--color-primary: #2e324c;',
	'--color-secondary: #f6f6f6;',
	'--text-color-highlight: #000000c9;',
	'--text-color-primary: #121212;',
	'--folder-button-color: #000000a6;',
	'--button-highlight: rgba(0, 0, 0, 0.06);',
	'--color-highlight-faded: rgba(0, 0, 0, 0.06);',
	'--color-accent: #1c6ef3;',
	'--darker-bg: #1c1d1f;',
	'--text-box: #ffffff;',
	'--text-box-outline: rgba(0, 0, 0, 0.06);',
	'--menu-bg: #ededed;',
	'--sidbar-highlight: #f7f7f7;',
	'--sidebar-toggle: #f7f7f7;',
	'--nav-dropdown: #ededed;',
	'--slider-drawer: #fefefe;',
	'--action-total-text-color: #12131494;',
	'--input-bg: #ededed4f;',
	'--meun-blur-bg: #e4e5e7ed;',
	'--file-selected-bg: #e2e2e24a;',
	'--file-tree-weight: 450;',
	'--shadow: 0px 6px 3px -2px #0000000a;',
	'--search-bar-bg: #e6e6e6;',
	'--button-blue: #2b4a6b;',
	'--button-blue-hover: #375e88;',
	'--search-button: #e6e6e6;',
	'--color-primary-muted: #2e324c26;',
	'--search-result-card: #ededed;',
	'--home-gradient-color-1: #f6f6f6;',
	'--home-gradient-color-2: #d0d0d0;',
	'--list-item-hover: #efeff0;',
	'--leading-icon-bg: #52505029;',
	'--list-item-bg-default: #444449fc;'
]);

const darkTheme = readable([
	'--color-primary: #f6f6f6;',
	'--color-secondary: #121314;',
	'--text-color-highlight: #ffffff;',
	'--text-color-primary: #e8eaed;',
	'--button-highlight: #1C1D1F;',
	'--faded-highlight: #1c1d1f6e;',
	'--folder-button-color: #ccccccbf;',
	'--color-highlight-faded: rgba(0, 0, 0, 0.1);',
	'--color-accent: #4ca5ff;',
	'--darker-bg: #121314;',
	'--text-box: #1a1b1d;',
	'--text-box-outline: rgb(44 44 44);',
	'--menu-bg: #1d1e20;',
	'--drawer-bg: #1d1e205c;',
	'--sidbar-highlight: #242528;',
	'--sidebar-toggle: #1c1d1fab;',
	'--nav-dropdown: #1c1d1f;',
	'--slider-drawer: #151617;',
	'--action-total-text-color: #dadada;',
	'--input-bg: #ededed;',
	'--meun-blur-bg: #1c1d1fed;',
	'--file-tree-weight: 350;',
	'--file-selected-bg: #2b2c2f96;',
	'--shadow: 0px 6px 3px -2px #00000066;',
	'--search-bar-bg: #171819;',
	'--button-blue: #2b4a6b;',
	'--button-blue-hover: #375e88;',
	'--search-button: #1c1d1fab;',
	'--color-primary-muted: #f6f6f61c;',
	'--search-result-card: #242528;',
	'--home-gradient-color-1: #43484cb3;',
	'--home-gradient-color-2: #1d1e21;',
	'--list-item-hover: #53555c;',
	'--leading-icon-bg: #1d1e206e;',
	'--list-item-bg-default: #4446495e;'
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
					? [
							...$baseTheme,
							...$lightTheme,
							...$fontTheme,
							`--nav-width: ${$gridWidth ? $gridWidth + 'px' : '100%'} ;`
					  ]
					: [
							...$baseTheme,
							...$darkTheme,
							...$fontTheme,
							`--nav-width: ${$gridWidth ? $gridWidth + 'px' : '100%'} ;`
					  ]
		};
	}
);
