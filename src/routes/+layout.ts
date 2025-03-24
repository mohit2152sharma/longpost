import { posthogInit } from '$lib/analytics';

export const load = async () => {
	posthogInit();
};
