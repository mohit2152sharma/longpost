import type { RequestEvent } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { LoginCredentialsSchema } from '$lib/server/bsky/types';
import { bskyLogin } from '$lib/server/bsky/auth';
import { redirect } from '@sveltejs/kit';
import { setSessionTokenCookie } from '$lib/server/auth';

export const load = async () => {
	const form = await superValidate(zod(LoginCredentialsSchema));
	return { form };
};

// FIXME: refresh token is not working
// Once the user is logged in, it's access token is saved as a session cokie
// but this access token becomes invalid after sometime, so we need to refresh it
// by logging the user again.
export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(LoginCredentialsSchema));

		if (form.valid) {
			const credentials = form.data;
			const response = await bskyLogin({ credentials });

			if (!response) {
				return fail(400, { form: form, message: 'Invalid Credentials' });
			}
			console.info('Login successful');
			const token = JSON.stringify({
				bskyDid: response.did,
				bskyAccessJwt: response.accessJwt,
				bskyHandle: response.handle
			});
			setSessionTokenCookie(event, token);
			const redirectTo = event.url.searchParams.get('redirectTo');
			if (redirectTo) {
				throw redirect(302, `/${redirectTo.slice(1)}`);
			}
			throw redirect(300, '/');
		} else {
			return fail(400, { form });
		}
	}
};
