// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				did: string;
				handle: string;
				accessJwt: string;
				refreshJwt: string;
				userId: string;
				isSubscribed: boolean;
			} | null;
		}
	}
}

export {};
