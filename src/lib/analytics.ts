import { browser } from '$app/environment';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import { env } from '$env/dynamic/public';
import posthog, { type PostHogConfig } from 'posthog-js';

export const POSTHOG_PROJECT_KEY = env.PUBLIC_POSTHOG_PROJECT_KEY;
export const posthogConfig = <PostHogConfig>{
	api_host: 'https://us.i.posthog.com',
	person_profiles: 'always',
	capture_pageview: false,
	capture_pageleave: false
};

export function posthogInit() {
	if (browser) {
		if (!POSTHOG_PROJECT_KEY) {
			console.error('cannot find posthog key');
		} else {
			posthog.init(POSTHOG_PROJECT_KEY, posthogConfig);
		}
	}
}

export function setupPageCaptureEvent() {
	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
}
