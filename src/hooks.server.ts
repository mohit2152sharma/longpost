import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import * as bsky from '$lib/server/bsky/auth';
import { redirectToLogin } from '$lib/lib-utils';
import { Logger } from '$lib/logger';

const logger = new Logger();
const skipLoginCheckUrls = ['/login', '/webhooks/stripe'];

const handleAuth: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	if (skipLoginCheckUrls.some((url) => pathname.startsWith(url))) {
		return resolve(event);
	}
	const sessionToken = auth.getSessionTokenCookie(event);
	if (!sessionToken) {
		event.locals.user = null;
		const redirectTo = redirectToLogin(event);
		if (!redirectTo) {
			throw redirect(302, '/home');
		}
		throw redirect(302, redirectTo);
	}

	event.locals.user = JSON.parse(sessionToken);
	const decodedJwt = auth.decodeJwt(event.locals.user!.accessJwt);
	if (!decodedJwt || auth.expiredJwt(decodedJwt)) {
		logger.info('Token has expired, refreshing...');
		const refreshedToken = await bsky.bskyRefreshToken(JSON.parse(sessionToken));
		if (!refreshedToken) {
			throw redirect(302, '/login');
		} else {
			const token = {
				did: refreshedToken.did,
				accessJwt: refreshedToken.accessJwt,
				refreshJwt: refreshedToken.refreshJwt,
				handle: refreshedToken.handle,
				userId: event.locals.user!.userId,
				isSubscribed: event.locals.user!.isSubscribed
			};
			event.locals.user = token;
			auth.setSessionTokenCookie(event, JSON.stringify(token));
		}
	}
		
	logger.info(`User is authenticated: ${event.locals.user?.handle}`);
	return resolve(event);
};

export const handle: Handle = handleAuth;
