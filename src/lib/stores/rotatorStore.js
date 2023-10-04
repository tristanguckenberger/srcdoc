import { writable } from "svelte/store";

export const currentSlide = writable(0);

export const previousSlide = writable(0);

export const nextSlide = writable(0);

export const dotIndex = writable(0);

export const runDotNavHandler = writable(false);