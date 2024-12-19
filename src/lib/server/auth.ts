import type { RequestEvent } from '@sveltejs/kit';
import { Logger } from '$lib/logger';

const logger = new Logger();

export const sessionCookieName = 'auth-session';

export function setSessionTokenCookie(event: RequestEvent, token: string) {
	event.cookies.set(sessionCookieName, token, {
		path: '/',
		httpOnly: true,
		secure: true
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export function getSessionTokenCookie(event: RequestEvent) {
	return event.cookies.get(sessionCookieName);
}

export type DecodedJwt = {
	scope: string;
	sub: string;
	iat: string;
	exp: number;
	aud: string;
};

export function decodeJwt(token: string): DecodedJwt | undefined {
	try {
		const payloadBase64 = token.split('.')[1]; // Extract the payload part of the JWT
		if (!payloadBase64) throw new Error('Invalid JWT');

		const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')); // Decode Base64
		return JSON.parse(payload); // Parse the JSON payload
	} catch (error) {
		logger.error(`Failed to decode JWT: ${error}`);
		return;
	}
}

export function expiredJwt(decodedJwt: DecodedJwt): boolean {
	return decodedJwt.exp < Date.now() / 1000;
}
