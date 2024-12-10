import type { User, LoginCredentialsSchemaType } from '$lib/server/bsky/types';
import { BskyAgent } from '@atproto/api';

export const AUTH_TOKEN_KEY = 'auth_token';

export const checkAuthStatus = (): User => {
	if (typeof window === 'undefined') {
		return { isAuthenticated: false, token: null };
	}

	const sessionData = sessionStorage.getItem('sessionData');
	if (sessionData) {
		const token = JSON.parse(sessionData).accessJwt;
		return {
			isAuthenticated: !!token,
			token
		};
	} else {
		return { isAuthenticated: false, token: null };
	}
};

export const setAuthToken = (token: string): void => {
	localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const bskyLogin = async ({ credentials }: { credentials: LoginCredentialsSchemaType }) => {
	const agent = new BskyAgent({ service: 'https://bsky.social' });
	try {
		const response = await agent.login({
			identifier: credentials.identifier,
			password: credentials.password
		});

		if (!response.success) {
			return false;
		}
		return response.data;
	} catch (err) {
		console.error(err);
		return false;
	}
};
