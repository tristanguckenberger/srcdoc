// @ts-nocheck
import { writable, derived } from 'svelte/store';
const createWritableStore = (key, startValue) => {
	const { subscribe, set } = writable(startValue);

	return {
		subscribe,
		set,
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe((current) => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
};

export const editorOutContainerHeight = writable(null);
export const editorOutContainerWidth = writable(null);
export const editorContainerHeight = writable(null);
export const editorContainerWidth = writable(null);
export const paneMinHeightModifier = writable(30);
export const clientWidth = writable(0);
export const rightPanelWidth = createWritableStore('rightPanelWidth', null);
export const dropWidth = createWritableStore('dropWidth', null);
export const showCollectives = writable(false);
export const showPosts = writable(true);
export const hideBackground = writable(false);
export const showAuthModal = writable(false);
export const showPreferences = writable(false);
export const isDarkModeStore = createWritableStore('isDarkModeStore', false);
export const redirected = writable(false);
export const isVertical = writable(true);
export const appClientWidth = writable(null);

export const gridWidth = writable(0);

// Sidebar
export const sideBarWidth = writable(null);
export const sideBarState = writable(true);

export const modalState = writable({});

export const modalOpenState = writable(false);
export const modalComponent = writable(null);
export const modalProps = writable({});

export const modalStateStore = derived(
	[modalOpenState, modalComponent, modalProps],
	([$modalOpenState, $modalComponent, $modalProps]) => {
		return {
			modalOpenState: $modalOpenState,
			modalComponent: $modalComponent,
			modalProps: $modalProps
		};
	}
);
