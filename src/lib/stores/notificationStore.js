// @ts-nocheck
import { writable } from 'svelte/store';

export const notifications = writable([]);
export const showNotifications = writable(false);

export function addNotification(notification) {
	notifications.update((n) => [...n, notification]);
}
