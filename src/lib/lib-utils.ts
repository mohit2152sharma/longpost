import type { RequestEvent } from '@sveltejs/kit';
import { Logger } from './logger';
import fs from 'fs/promises';

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

async function removeFile(filePath: string): Promise<void> {
	try {
		logger.info(`Removing file ${filePath}`);
		await fs.unlink(filePath);
	} catch (e: unknown) {
		if (isNodeError(e)) {
			if (e.code === 'ENOENT') {
				logger.error(`File ${filePath} does not exist`);
			} else {
				logger.error(`Error while removing file ${filePath}: ${e.message}`);
			}
		} else {
			logger.error(`Error while removing file ${filePath}: ${e}`);
		}
	}
}

function isNodeError(e: unknown): e is NodeJS.ErrnoException {
	return e instanceof Error && 'code' in e;
}

export { onlyOneParam, retryFetch, redirectToLogin, removeFile };
