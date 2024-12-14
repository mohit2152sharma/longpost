import type { PageServerLoad, RequestEvent } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { BskyContentSchema } from '$lib/server/bsky/types';
import { bskyThreads } from '$lib/server/bsky/posts';

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

			const sessionData = {
				did: event.locals.user!.bskyDid,
				accessJwt: event.locals.user!.bskyAccessJwt
			};
			const response = await bskyThreads('https://bsky.social', sessionData, parsedValues);

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
