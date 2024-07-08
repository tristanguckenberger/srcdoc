// @ts-nocheck
import { writable } from 'svelte/store';
import { copyData } from '$lib/platformCopy/copyData';

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

export const infoStore = createWritableStore('infoStore', {});
export const homePageInfoStore = createWritableStore('homePageInforStore', {
	info: copyData?.fullInfoCopy?.homePageInfo?.firstLanding,
	store: copyData?.fullInfoCopy?.homePageInfo?.firstLanding?.store,
	viewed: false
});

export const gamePageInfoStore = createWritableStore('gamePageInfoStore', {
	info: copyData?.fullInfoCopy?.gamePageInfo,
	store: copyData?.fullInfoCopy?.gamePageInfo?.store,
	viewed: false
});

export const editorPageInfoStore = createWritableStore('editorPageInfoStore', {
	info: copyData?.fullInfoCopy?.editorPageInfo?.firstLanding,
	store: copyData?.fullInfoCopy?.editorPageInfo?.firstLanding?.store,
	viewed: false
});

export const libraryPageInfoStore = createWritableStore('libraryPageInfoStore', {
	info: copyData?.fullInfoCopy?.libraryPageInfo,
	store: copyData?.fullInfoCopy?.libraryPageInfo?.store,
	viewed: false
});

export const userPfpStore = createWritableStore('userPfpStore', null);
export const userBioStore = createWritableStore('userBioStore', null);
export const userIdStore = createWritableStore('userIdStore', null);
export const userUsernameStore = createWritableStore('userUsernameStore', null);

export const modalFullInfoStore = writable(null);
