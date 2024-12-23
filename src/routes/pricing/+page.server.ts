import type { RequestEvent } from '../$types';

export const load = (event: RequestEvent) => {
	return {
		userId: event.locals.user?.userId,
		bskyHandle: event.locals.user?.handle,
		isSubscribed: event.locals.user?.isSubscribed
	};
};
