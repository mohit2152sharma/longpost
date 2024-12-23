import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';

export const load = (event: RequestEvent) => {
	throw redirect(302, '/home');

	// TODO: Stripe doesn't work in India, enable when it starts working
	return {
		userId: event.locals.user?.userId,
		bskyHandle: event.locals.user?.handle,
		isSubscribed: event.locals.user?.isSubscribed
	};
};
