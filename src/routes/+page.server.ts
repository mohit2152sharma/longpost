import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { Logger } from '$lib/logger';
import { getSessionTokenCookie } from '$lib/server/auth';

const logger = new Logger();

export const actions = {
	default: async (event: RequestEvent) => {
		const sessionToken = getSessionTokenCookie(event);
		if (sessionToken) {
			const { handle } = JSON.parse(sessionToken);
			if (handle) {
				logger.info('User is already logged in, redirect to home');
				return redirect(302, '/home');
			} else {
				logger.info('User is not logged in, redirect to login');
				return redirect(302, '/login');
			}
		} else {
			logger.info('User is not logged in, redirect to login');
			return redirect(302, '/login');
		}
	}
};
