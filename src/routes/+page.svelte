<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import posthog from 'posthog-js';
</script>

<div class="flex h-[90vh] flex-col items-center justify-center space-y-6">
	<div class="flex flex-col items-center space-y-4">
		<h1 class="text-9xl font-bold underline">Longpost</h1>
		<div>
			<p class="text-xl italic">Post your code snippets without distraction on bluesky</p>
		</div>
	</div>
	<div class="text-sm italic">
		<ul class="list-inside list-disc">
			<li>Automatically splits long text into Bluesky threads</li>
			<li>Identifies code snippets within the text</li>
			<li>Converts code snippets into beautiful code images with syntax highlighting</li>
			<li>Publish unlimited posts and threads directly to Bluesky</li>
		</ul>
	</div>
	<div class="">
		<form method="POST">
			<Button
				id="get-started-button"
				type="submit"
				onclick={() => posthog.capture('button_clicked', { button_name: 'get-started-button' })}
				>Get Started</Button
			>
		</form>
	</div>
</div>
