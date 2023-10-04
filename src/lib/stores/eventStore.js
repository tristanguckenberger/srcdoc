import { writable } from 'svelte/store';

export const messageEvent = writable([]);
const last_console_event = writable({});

function push_logs(logs, log) {
	messageEvent.set([...logs, log]);
}

export function destroyLogs() {
	messageEvent.set([]);
	last_console_event.set({});
}

export function eventStoreLogHandler(logs, log) {
	if (log?.level === 'clear') {
		logs = [log];
	} else if (log?.duplicate) {
		const last_log = logs[logs?.length - 1];
		if (last_log) {
			last_log.count = (last_log?.count || 1) + 1;
			// eslint-disable-next-line no-self-assign
			logs = logs;
		} else {
			// @ts-ignore
			last_console_event.count = 1;
			logs = [last_console_event];
		}
	} else {
		push_logs(logs, log);
		last_console_event.set(log);
	}
}
