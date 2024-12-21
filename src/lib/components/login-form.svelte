<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../routes/$types';
	import type { LoginCredentialsSchemaType } from '$lib/server/bsky/types';
	import LoadingButton from './custom-comps/loading-button.svelte';

	export let data: PageData & { form: LoginCredentialsSchemaType };
	const { form, submitting, enhance } = superForm(data.form);
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>With your Bluesky Handle and App password</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance action="?/login">
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="identifier">Bluesky Handle</Label>
					<Input
						id="identifier"
						name="identifier"
						placeholder="user.bsky.social"
						bind:value={$form.identifier}
						required
					/>
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">App Password</Label>
						<a
							href="https://blueskyfeeds.com/en/faq-app-password"
							class="ml-auto inline-block text-sm underline"
							target="_blank"
							rel="noreferrer"
						>
							App Password?
						</a>
					</div>
					<Input
						id="password"
						bind:value={$form.password}
						type="password"
						name="password"
						required
					/>
				</div>
				<LoadingButton submitting={$submitting} cls="w-full" />
			</div>
		</form>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a target="_blank" rel="noopener noreferrer" href="https://bsky.app" class="underline">
				Sign up on Bluesky
			</a>
		</div>
	</Card.Content>
</Card.Root>
