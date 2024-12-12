import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RequestEvent } from '@sveltejs/kit';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// TODO: move this function to lib-utils as this file gets
// overwritten by shadcn
export function handleLoginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	console.log(event);
	console.log(redirectTo);
	return `/login?redirectTo=${redirectTo}`;
}
