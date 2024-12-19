import type { RequestEvent } from './$types';

export const load = (event: RequestEvent) => {
	return {
		userId: event.locals.user?.userId
	};
};
