import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RequestEvent } from "@sveltejs/kit";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function handleLoginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search
	console.log(event)
	console.log(redirectTo)
	return `/login?redirectTo=${redirectTo}`
}
