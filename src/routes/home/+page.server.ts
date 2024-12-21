import type { PageServerLoad, RequestEvent } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { BskyContentSchema, type SessionData } from '$lib/server/bsky/types';
import { bskyThreads } from '$lib/server/bsky/posts';
import { insertPost } from '$lib/server/db/utils';
import type { PostInsert } from '$lib/server/db/schema';
import { Logger } from '$lib/logger';
import { redirect } from '@sveltejs/kit';

const logger = new Logger();

export const load: PageServerLoad = async (event: RequestEvent) => {
	const user = event.locals.user
	if (!user) {
		logger.info('User is not logged in, redirecting to login page')
		throw redirect(302, '/login')
	} else {
		const form = await superValidate(zod(BskyContentSchema));
		return {
			form,
			userId: user.userId,
			isSubscribed: user.isSubscribed,
			bskyHandle: user.handle
		}
	};
};

export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(BskyContentSchema));

		if (form.valid) {
			const parsedValues = BskyContentSchema.parse(form.data);

			const sessionData = event.locals.user as SessionData;
			const response = await bskyThreads('https://bsky.social', sessionData, parsedValues);

			if (!response.success) {
				return setError(form, 'content', response.message);
			} else {
				const post: PostInsert = {
					postText: parsedValues.content,
					createdBy: event.locals.user!.userId
				};
				try {
					await insertPost(post);
					logger.info(`Post inserted successfully`);
				} catch (error) {
					logger.error(`Failed to insert post: ${post.postText}, with error: ${error}`);
				}
				return message(form, response.success);
			}
		} else {
			return fail(400, { form, message: `Failed to create a post, please try after some time` });
		}
	}
};
