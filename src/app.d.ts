// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session } from 'svelte-kit-cookie-session';

type SessionData = {
	views: number;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session<SessionData>;
		}
		interface PageData {
			// can add any properties here, return it from your root layout
			session: SessionData;
		}
		// interface Platform {}
	}
}

export {};
