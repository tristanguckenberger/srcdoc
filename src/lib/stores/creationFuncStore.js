import { writable } from "svelte/store";
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
      },
    };
};

export const creationStorePostCreationFunc = writable(null);
export const creationStoreProjectCreationFunc = writable(null);
export const runSave = createWritableStore("runSave",false);