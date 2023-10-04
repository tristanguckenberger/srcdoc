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
export const isCreationStore = createWritableStore("isCreationStore", false);
export const isPostStore = writable(false);
export const isAuthStore = writable(false);
export const postDetailStarter = writable({});
export const thumbnailStore = writable(null);
export const currentPostTitle = writable(null);
export const postAuthor = writable(null);

// export const local_store_name = createWritableStore("local_store_name", type);
// createWritableStore("currentPost", {});
// export const currentPost = writable({});
export const currentPost = createWritableStore("currentPost", {});
export const currentPostPage = createWritableStore("currentPostPage", {});
export const currentPostPageRevert = createWritableStore("currentPostPageRevert", {});
export const currentPostPageId = createWritableStore("currentPostPageId", "");
// export const currentPostPage = writable({});
export const postList = writable([]);
