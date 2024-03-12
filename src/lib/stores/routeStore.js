// @ts-nocheck
import { derived, writable } from 'svelte/store';
import { page } from '$app/stores';

export const visitedRoutes = writable([]);
export const routeHistoryStore = derived([page, visitedRoutes], ([$page, $visitedRoutes]) => {
	let route = $page?.url?.pathname;
	if (route) {
		if ($visitedRoutes[$visitedRoutes?.length - 1] !== route && route !== '/favicon.png') {
			visitedRoutes.set([...$visitedRoutes, route]);
		}
	}

	if ($visitedRoutes?.length >= 5) {
		visitedRoutes.set($visitedRoutes.slice(1));
	}

	// Check if the user navigated to the previous route
	if ($visitedRoutes?.length >= 2 && $visitedRoutes[$visitedRoutes.length - 2] === route) {
		visitedRoutes.set($visitedRoutes.slice(0, -1));
	}

	return $visitedRoutes;
});
