// @ts-nocheck
import { writable } from 'svelte/store';

const initialState = {
	startTime: null,
	elapsedTime: 0,
	gameCompleted: false,
	isPaused: true,
	userScore: 0,
	currentGame: null
};

function createGameSessionStore() {
	const { subscribe, set, update } = writable({ ...initialState });

	// Function to set the initial state of the game session
	function setInitialState(newInitialState = {}) {
		set({ ...initialState, ...newInitialState });
	}

	// Function definitions will go here
	function start() {
		set({ ...initialState, startTime: Date.now(), isPaused: false });
	}

	function resume() {
		update((s) => {
			if (s.isPaused) {
				return { ...s, isPaused: false, startTime: Date.now() };
			}
			return s;
		});
	}

	function pause() {
		update((s) => {
			if (!s.isPaused && s.startTime) {
				const currentTime = Date.now();
				const updatedElapsedTime = s.elapsedTime + (currentTime - s.startTime);
				// Store the updatedElapsedTime to account for the time before pausing
				return { ...s, elapsedTime: updatedElapsedTime, isPaused: true, startTime: null };
			}
			return s;
		});
	}

	function stop(userScore) {
		update((s) => {
			const currentTime = Date.now();
			// Calculate final elapsed time only if the game wasn't paused when stopped
			const finalElapsedTime = s.isPaused
				? s.elapsedTime
				: s.elapsedTime + (currentTime - s.startTime);
			return {
				...s,
				elapsedTime: finalElapsedTime,
				gameCompleted: true,
				userScore: userScore,
				startTime: null
			};
		});
	}

	function updateScore(score) {
		update((s) => ({ ...s, userScore: score }));
	}

	return {
		subscribe,
		start,
		pause,
		resume,
		stop,
		updateScore,
		setInitialState
	};
}

export const gameSession = createGameSessionStore();
