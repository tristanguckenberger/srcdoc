import { writable } from "svelte/store";

// export const htmlStore = writable({});

// export const cssStore = writable({});

// export const jsStore = writable({});

// export const codeToSave = writable({});


export const lockPageStore = writable(false);

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
      
      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export const changingPage = createWritableStore('changingPage', false);
export const htmlStore = createWritableStore('htmlStore',{});
export const selectedValue = createWritableStore('selected', null);
export const cssStore = createWritableStore('cssStore',{});
export const jsStore = createWritableStore('jsStore',{});
export const pageStore = createWritableStore('pages', null);
export const showCaptureThumbnail = writable(false);


export const projectStore = createWritableStore('projectStore', {});
export const initialPostData = createWritableStore('initialPostData', {});
export const codeToSave = createWritableStore('codeToSave',{});
export const selectedStore = writable({});;


export const localCodeStoreHTML = writable({});
export const localCodeStoreCSS = writable({});
export const localCodeStoreJS = writable({});


export const triggerReset = writable(false);

export const toggleUpdateCodeWithPost = writable(false);
