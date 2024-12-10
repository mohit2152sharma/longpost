import type { User, LoginCredentials } from '~/lib/types/auth';
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

export const bskyLogin = async ({ credentials }: { credentials: LoginCredentials }) => {
	const agent = new BskyAgent({ service: 'https://bsky.social' });
	try {
		const response = await agent.login({
			identifier: credentials.identifier,
			password: credentials.password
		});

		if (!response.success) {
			return false;
		}

		console.log('Logged in successfully');
		console.log(response);
		console.log(response.data);
		const sessionData = {
			did: response.data.did,
			accessJwt: response.data.accessJwt
		};
		sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
