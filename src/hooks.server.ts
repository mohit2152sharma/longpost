import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { handleLoginRedirect } from '$lib/utils';

const handleAuth: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	if (pathname.startsWith('/login')) {
		return resolve(event);
	}
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		const redirectTo = handleLoginRedirect(event);
		throw redirect(302, redirectTo);
	}

	event.locals.user = JSON.parse(sessionToken);

	// TODO: Reuse the following code for session management with database
	// const { session, user } = await auth.validateSessionToken(sessionToken);
	// if (session) {
	// 	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	// } else {
	// 	auth.deleteSessionTokenCookie(event);
	// }
	//
	// event.locals.user = user;
	// event.locals.session = session;
	//
	return resolve(event);
};

export const handle: Handle = handleAuth;
