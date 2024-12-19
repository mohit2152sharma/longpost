import type { LoginCredentialsSchemaType, SessionData } from '$lib/server/bsky/types';
import { BskyAgent } from '@atproto/api';
import { Logger } from '$lib/logger';

const logger = new Logger();

export const AUTH_TOKEN_KEY = 'auth_token';

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
		logger.error(String(err));
		return false;
	}
};

export const bskyRefreshToken = async (sessionToken: SessionData) => {
	const response = await fetch('https://bsky.social/xrpc/com.atproto.server.refreshSession', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionToken.refreshJwt}`
		}
	});

	if (!response.ok) {
		logger.error(`Failed to refresh token: ${response.status} ${response.statusText}`);
		return;
	} else {
		return await response.json();
	}
};
