import type { RequestEvent } from '@sveltejs/kit';
import { Logger } from './logger';

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
const logger = new Logger();

function redirectToLogin(event: RequestEvent) {
	const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
	return `/login?redirectTo=${redirectTo}`;
}

function onlyOneParam(...args: (string | number | boolean | undefined | null)[]) {
	if (args.every((arg) => arg)) {
		throw new Error('Only one param allowed');
	} else if (args.every((arg) => !arg)) {
		throw new Error('Need to provide atleast one param');
	} else {
		return args.filter((arg) => arg)[0];
	}
}

async function retryFetch(
	fetchUrl: string,
	method: FetchMethod,
	headers: Record<string, string>,
	body: RequestInit['body'],
	retry: boolean = true,
	retryLimit: number = 3
): Promise<Response> {
	let retryCount = 0;
	let lastResponse: Response | undefined = undefined;

	if (retry) {
		while (retryCount < retryLimit) {
			lastResponse = await fetch(fetchUrl, {
				method: method,
				headers: headers,
				body: body
			});
			if (!lastResponse.ok) {
				logger.error(
					`Failed to fetch: status: ${lastResponse.status}, statusText: ${lastResponse.statusText}`
				);
				logger.info(`Retrying in ${retryCount + 1} seconds...`);
				retryCount++;
			} else {
				break;
			}
		}
	} else {
		lastResponse = await fetch(fetchUrl, {
			method: method,
			headers: headers,
			body: body
		});
	}

	return lastResponse || new Response(null, { status: 500, statusText: 'Fetch failed' });
}

export { onlyOneParam, retryFetch, redirectToLogin };
