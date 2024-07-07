// @ts-nocheck
import { addNotification } from './notificationStore';
import { writable } from 'svelte/store';

function handleIncomingMessage(message) {
	// Parse the incoming message and add it to the notifications store
	const notification = JSON.parse(message);
	addNotification(notification);
}

export const socket = writable(null);

export function connectWebSocket(userId) {
	const url = import.meta.env.VITE_WEBSOCKET_SERVER_URL; // Access environment variable
	const ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('Connected to WebSocket server');

		// Register the user with the WebSocket server
		const registerMessage = JSON.stringify({
			type: 'register',
			userId // Replace with the actual user ID
		});

		console.log('Registering user with WebSocket server');
		console.log('registerMessage::', registerMessage);
		ws.send(registerMessage);
	};

	ws.onmessage = (event) => {
		console.log('Message from server: ', event.data);
		// Handle incoming message
		handleIncomingMessage(event.data);
	};

	ws.onclose = () => {
		console.log('Disconnected from WebSocket server');
	};

	ws.onerror = (error) => {
		console.error('WebSocket error: ', error);
	};

	socket.set(ws);
}
