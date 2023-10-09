import { gameData } from '$lib/mockData/gameData.js';

export function load() {
	return {
		games: [...gameData]
	};
}
