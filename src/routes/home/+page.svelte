<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Textarea } from '$lib/components/ui/textarea';
	import { superForm } from 'sveltekit-superforms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { PageData } from './$types';
	import LoadingButton from '$lib/components/custom-comps/loading-button.svelte';
	import type { BskyContentSchemaType } from '$lib/server/bsky/types';
	import Navbar from '$lib/components/custom-comps/navbar.svelte';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Button } from '$lib/components/ui/button';
	import type { ButtonEvent } from '$lib/types/events';
	import { page } from '$app/stores';
	import posthog from 'posthog-js';

	export let data: PageData & {
		userId: string;
		did: string;
		isSubscribed: boolean;
		bskyHandle: string;
		form: BskyContentSchemaType;
	};
	const form = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Post created successfully to Bluesky!');
			}
		}
	});
	const { form: formData, submitting, enhance } = form;
	// if isSubscribed is true, then the checkbox should be enabled
	const enableCheckBox = data.isSubscribed;

	const postButtonClicked: ButtonEvent = {
		event_name: 'post_button_clicked',
		__identify: {
			profileId: data.did
		},
		event_props: {
			button_name: 'post',
			button_title: 'Post',
			button_page_name: $page.url.pathname,
			button_page_url: $page.url.toString()
		}
	};

	const supportButtonClicked: ButtonEvent = {
		event_name: 'support_button_clicked',
		__identify: {
			profileId: data.did
		},
		event_props: {
			button_name: 'support',
			button_title: 'Support',
			button_page_name: $page.url.pathname,
			button_page_url: $page.url.toString()
		}
	};

	const checkBoxClicked: ButtonEvent = {
		event_name: 'checkbox_button_clicked',
		__identify: {
			profileId: data.did
		},
		event_props: {
			button_name: 'checkbox',
			button_title: 'Checkbox',
			button_page_name: $page.url.pathname,
			button_page_url: $page.url.toString()
		}
	};
</script>

<Navbar bskyHandle={data.bskyHandle} isSubscribed={enableCheckBox} />

<Toaster />
<div class="m-4 flex flex-col items-center">
	<form method="POST" class="flex w-1/2 flex-col gap-4 space-y-4" use:enhance>
		<Form.Field {form} name="content">
			<Form.Control>
				<Form.Label class="text-3xl font-bold">Post Threads</Form.Label>
				<Textarea
					class="h-[50vh]"
					placeholder="What's on your mind?"
					bind:value={$formData.content}
				/>
				<input type="hidden" name="content" bind:value={$formData.content} />
			</Form.Control>
			<Form.Description></Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex flex-row justify-between">
			<div class="flex flex-row items-center space-x-3">
				<LoadingButton
					buttonTitle="Post"
					submitting={$submitting}
					onclick={() =>
						posthog.capture(postButtonClicked.event_name, postButtonClicked.event_props)}
				/>
				<Form.Field {form} name="shoutout">
					<Form.Control>
						{#if enableCheckBox}
							<div class="flex flex-row items-center space-x-2">
								<Checkbox
									id="shoutout"
									name="shoutout"
									bind:checked={$formData.shoutout}
									onclick={() =>
										posthog.capture(checkBoxClicked.event_name, checkBoxClicked.event_props)}
								/>
								<Form.Label class="text-sm font-light italic"
									>Add "created by Longpost" to the end of your post</Form.Label
								>
							</div>
						{:else}
							<div class="flex flex-row items-center">
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<div class="flex flex-row items-center space-x-2">
												<Checkbox id="shoutout" name="shoutout" checked disabled />
												<Form.Label class="text-sm font-light italic"
													>Add "created by Longpost" to the end of your post</Form.Label
												>
											</div>
										</Tooltip.Trigger>
										<Tooltip.Content>
											<p>
												<a href="/pricing" target="_blank">Upgrade to remove Longpost branding</a>
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							</div>
						{/if}
					</Form.Control>
				</Form.Field>
			</div>
			<div>
				<Button
					class="bg-red-400"
					href="https://ko-fi.com/montepy"
					onclick={() =>
						posthog.capture(supportButtonClicked.event_name, supportButtonClicked.event_props)}
					>Support feature development</Button
				>
			</div>
		</div>
	</form>
</div>

<div class="mt-16 flex flex-col items-center">
	<div class="m-4 flex w-1/2 flex-col items-center justify-center space-y-4">
		<h2 class="text-xl font-bold underline">How it works</h2>
		<div>
			<ul class="list-inside list-disc">
				<li>Write in your text or paste in your text.</li>
				<li>
					If the text is above 300 characters (bluesky character limit), it will be split into
					multiple posts.
				</li>
				<li>You can also include code snippets inside your text.</li>
				<li>
					Code snippets must be enclosed within tripple ticks and it must have a language
					identifier, this enables syntax highlighting.
				</li>
				<li>
					For example: <br />
					<div class="mt-2 pl-8 text-sm">
						Hello world in javascript<br /><code
							>```javascript<br /> console.log('Hello World!')<br />```</code
						>
					</div>
				</li>
				<li>
					The above code will be rendered as a beautiful code image. <a
						href="https://bsky.app/profile/montepy.in/post/3ldqwwzgf4y2o"
						target="_blank"
						class="text-blue-300 underline">(See here)</a
					>.
				</li>
				<li>
					The code inside the code snippet will copied over to the image and to the alt text of the
					image.
				</li>
				<li>
					The code text inside the code snippet will be replaced by a tag: <code>[image_1]</code>,
					the number depends on the number of code snippets you have and the same will be the title
					of the image.
				</li>
				<li>
					You can have as many code snippets as you want. If there are more than four code snippets
					in a post, rest of the code snippets will be pushed over to next post.
				</li>
				<li>
					For bugs and feature requests, please open a <Button
						size="sm"
						href="https://github.com/mohit2152sharma/longpost/issues">Pull Request</Button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
