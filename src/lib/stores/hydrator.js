import { writable } from "svelte/store";
import { sortComments, processPostData, pageArrBuilder } from '$lib/utilities/processing/index.js';
import { get as getUtil } from '$lib/utils';

function getComments(arg) {
  let id = arg;
  if (id) {
    const fetchURL = `../../api/comment/getComments/${id}.json`;
    return fetch(fetchURL, {
        method: 'GET'
    });
  } else {
    console.log('NO ID')
  }
   
}

function getPost(arg) {
  let id = arg;
  if (id) {
    const fetchURL = `../../api/post/getSinglePost/${id}.json`;
    return fetch(fetchURL, {
        method: 'GET'
    });
  } else {
    console.log('NO ID')
  }
}

function getProjects(arg) {
  let id = arg;
  if (id) {
    const fetchURL = `../../api/project/getAllProjectsForPost/${id}.json`;
    return fetch(fetchURL, {
        method: 'GET'
    });
  } else {
    console.log('NO ID')
  }
}


/**
 * 
 * @param {*} initial => this is a starting value
 * @param {*} loadFunction => this is the fetch function (get, post, put, delete)
 * @param {*} dataResolver => basically just a function from utilities
 * @returns a svelte store that loads asynchronously
 */
const asyncReadable = (initial, loadFunction, dataResolver) => {
    let loadPromise;

    const loadValue = async (arg, set, reload) => {

      // IF there isnt a loadFunc set here 
      // OR if the store that is created with
      // this func is called with .reload()
      // THEN set a function for fetching.
      // arg is an optional param that allows
      // you to pass in whatever  you want to 
      // your loadFunc
        if (!loadPromise || reload) {
            loadPromise = loadFunction(arg);
        }

        // get the data
        let loaded = loadPromise?.then(r => (r?.json()))
        let storeValue = await loaded;

        // pass the data to resolver func for processing
        let resolvedData = dataResolver(storeValue);

        // save and return the result
        set(resolvedData ?? storeValue);
        return (resolvedData ?? storeValue);
    };

    const { subscribe, set } = writable(initial, (set) => {
        loadValue(set);
    });

    return {
        // set,
        subscribe,
        load: (arg) => loadValue(arg, set),
        reload: (arg) => loadValue(arg, set, true),
    };
};

export const commentHydrator = asyncReadable(
    [], 
    getComments, 
    sortComments
);

export const postHydrator = asyncReadable(
    {},
    getPost, 
    processPostData
);

export const projectsHydrator = asyncReadable(
    [],
    getProjects, 
    pageArrBuilder
);