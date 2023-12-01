// @ts-nocheck
import { writable } from 'svelte/store';

export const session = writable(null);

export const commitSession = (session) => {
	session.set(session);
};
