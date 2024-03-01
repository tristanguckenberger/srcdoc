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
	const gameSessionState = writable({ ...initialState });

	const subscribe = gameSessionState.subscribe;
	const set = gameSessionState.set;
	const update = gameSessionState.update;

	// Function to set the initial state of the game session
	function setInitialState(newInitialState = {}) {
		set({ ...initialState, ...newInitialState });
	}

	// Function definitions will go here
	function start() {
		console.log('::start function called::');
		let currentState;
		gameSessionState.subscribe((value) => {
			console.log('::currentState::', value);
			currentState = value;
		});

		if (currentState?.startTime) return;

		try {
			set({ ...currentState, startTime: Date.now(), isPaused: false });
		} catch (error) {
			console.log('Error in start function::', error);
		}
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
		try {
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
					isPaused: null
				};
			});
		} catch (error) {
			console.log('Error in stop function::', error);
		}
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
export const gameSessionState = writable(null);
export const gameSessionScore = writable(0);
