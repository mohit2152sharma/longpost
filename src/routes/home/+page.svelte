<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { superForm } from 'sveltekit-superforms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { PageData } from './$types';
	import LoadingButton from '$lib/components/custom-comps/loading-button.svelte';

	export let data: PageData;
	const form = superForm(data.form);
	const { form: formData, submitting, enhance } = form;
</script>

<div class="m-4 flex flex-col items-center">
	<form method="POST" class="flex w-1/2 flex-col gap-4 space-y-4" use:enhance>
		<Form.Field {form} name="content">
			<Form.Control>
				<Form.Label class="text-3xl font-bold">Post text</Form.Label>
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
		<div class="flex flex-row items-center space-x-3">
			<LoadingButton buttonTitle="Post" submitting={$submitting} />
			<Form.Field {form} name="shoutout">
				<Form.Control>
					<div class="flex flex-row items-center space-x-2">
						<Checkbox id="shoutout" name="shoutout" bind:checked={$formData.shoutout} />
						<Form.Label class="text-sm font-light italic"
							>Add "created by Longpost" to the end of your post</Form.Label
						>
					</div>
				</Form.Control>
			</Form.Field>
		</div>
	</form>
</div>
