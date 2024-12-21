<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-screen flex-col items-center justify-center space-y-6">
	<div class="flex flex-col items-center space-y-4">
		<h1 class="text-9xl font-bold underline">Longpost</h1>
		<div>
			<p class="text-xl italic">Post your long thoughts without distraction on bluesky</p>
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
			<Button id="get-started-button" type="submit">Get Started</Button>
		</form>
	</div>
</div>
