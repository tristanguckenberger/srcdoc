import { writable } from "svelte/store";

export const filters = writable({});

export const refreshSwitch = writable(false);

export const showFilters = writable(false);