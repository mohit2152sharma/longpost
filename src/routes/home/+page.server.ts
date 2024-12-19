import type { PageServerLoad, RequestEvent } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { BskyContentSchema, type SessionData } from '$lib/server/bsky/types';
import { bskyThreads } from '$lib/server/bsky/posts';
import { insertPost } from '$lib/server/db/utils';
import type { PostInsert } from '$lib/server/db/schema';
import { Logger } from '$lib/logger';

const logger = new Logger();

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(BskyContentSchema));
	return { form };
};

export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(BskyContentSchema));

		if (form.valid) {
			const parsedValues = BskyContentSchema.parse(form.data);

			const sessionData = event.locals.user as SessionData;
			const response = await bskyThreads('https://bsky.social', sessionData, parsedValues);

			// upload the content to db
			const post: PostInsert = {
				postText: parsedValues.content,
				createdBy: event.locals.user!.userId
			};
			try {
				await insertPost(post);
			} catch (error) {
				logger.error(`Failed to insert post: ${post.postText}, with error: ${error}`);
			}

			if (!response.success) {
				return fail(502, { form: form, message: response.success });
			} else {
				return message(form, response.success);
			}
		} else {
			return fail(400, { form });
		}
	}
};
