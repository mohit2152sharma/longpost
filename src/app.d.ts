// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: { bskyDid: string; bskyHandle: string; bskyAccessJwt: string } | null;
			// TODO: Reuse the following code for session management with database
			// user: import('$lib/server/auth').SessionValidationResult['user'];
			// session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}

export {};
