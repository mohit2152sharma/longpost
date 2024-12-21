import type { RequestEvent } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { LoginCredentialsSchema, type SessionData } from '$lib/server/bsky/types';
import { bskyLogin } from '$lib/server/bsky/auth';
import { redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, setSessionTokenCookie } from '$lib/server/auth';
import { Logger } from '$lib/logger';
import { type UserInsert } from '$lib/server/db/schema';
import { checkAndInsertNewUser } from '$lib/server/db/utils';

const logger = new Logger();

export const load = async () => {
	const form = await superValidate(zod(LoginCredentialsSchema));
	return { form };
};

export const actions = {
	login: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(LoginCredentialsSchema));

		if (form.valid) {
			const credentials = form.data;
			const response = await bskyLogin({ credentials });

			if (!response) {
				logger.error(`Login failed for user: ${credentials.identifier}`);
				return fail(400, { form: form, message: 'Invalid Credentials' });
			}

			const token: SessionData = {
				did: response.did,
				accessJwt: response.accessJwt,
				handle: response.handle,
				refreshJwt: response.refreshJwt,
				userId: '',
				isSubscribed: false
			};

			// set user data in database
			const user: UserInsert = {
				did: response.did,
				email: response.email,
				handle: response.handle,
				isSubscribed: false
			};

			try {
				const userFromDb = await checkAndInsertNewUser(user);
				if (!userFromDb?.length) {
					throw new Error('Failed to insert user');
				}
				token.userId = userFromDb[0].id;
				token.isSubscribed = userFromDb[0].isSubscribed;
			} catch (error) {
				logger.error(`Failed to insert user: ${user.handle}, with error: ${error}`);
			}

			setSessionTokenCookie(event, JSON.stringify(token));
			const redirectTo = event.url.searchParams.get('redirectTo');
			logger.info(`${redirectTo}`);
			if (!redirectTo || redirectTo === '/') {
				throw redirect(302, '/home');
			} else {
				throw redirect(302, `/${redirectTo.slice(1)}`);
			}
		} else {
			return fail(400, { form });
		}
	},
	logout: async (event: RequestEvent) => {
		logger.info(`Logging out user: ${event.locals.user?.userId}`);
		deleteSessionTokenCookie(event);
		throw redirect(302, '/');
	}
};
