import type { RequestEvent } from '@sveltejs/kit';
import { Logger } from './logger';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
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

function checkBoolean(value: unknown) {
	return typeof value === 'string'
		? ['true', '1', 'yes', 'y'].includes(value.toLowerCase())
		: Boolean(value);
}

function isEnvDev() {
	const array = ['development', 'test', 'dev'];
	return array.includes(publicEnv.PUBLIC_MY_ENV)  || array.includes(privateEnv.MY_ENV);
}

function isEnvProd() {
	const array = ['production', 'prod'];
	return array.includes(publicEnv.PUBLIC_MY_ENV) || array.includes(privateEnv.MY_ENV);
}

function isEnvDevAndPostSuccess() {
	return isEnvDev() && checkBoolean(publicEnv.PUBLIC_BSKY_POST_SUCCESS);
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

	// Simulate posting to bsky in development
	logger.info(`Running in env: ${publicEnv.PUBLIC_MY_ENV}`);
	if (isEnvDev()) {
		if (publicEnv.PUBLIC_BSKY_POST_SUCCESS) {
			logger.info(
				`Running in dev environment and BSKY_POST_SUCCESS: ${publicEnv.PUBLIC_BSKY_POST_SUCCESS}, simulating success response`
			);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return new Response(JSON.stringify({ message: 'Post created successfully' }), {
				status: 200,
				statusText: 'OK'
			});
		} else {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			logger.info(
				`Running in dev environment and BSKY_POST_SUCCESS: ${publicEnv.PUBLIC_BSKY_POST_SUCCESS}, simulating failure response`
			);
			return new Response(null, { status: 500, statusText: 'Failed to post' });
		}
	} else {
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

function createBskyProfileUrl(handle: string) {
	return `https://bsky.app/profile/${handle}`;
}

export {
	onlyOneParam,
	retryFetch,
	redirectToLogin,
	removeFile,
	createBskyProfileUrl,
	isEnvDev,
	isEnvDevAndPostSuccess,
	checkBoolean,
	isEnvProd
};
