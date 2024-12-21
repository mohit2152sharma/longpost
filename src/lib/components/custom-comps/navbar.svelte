<script lang="ts">
	import AvatarPopover from './avatar-popover.svelte';
	import { Button } from '$lib/components/ui/button';

	export let isSubscribed: boolean;
	export let bskyHandle: string;

	const homeHref = bskyHandle ? '/home' : '/';
</script>

<nav>
	<div class="m-4 flex flex-row items-center justify-between">
		<div class="flex flex-row items-center space-x-4">
			<div>
				<div class="flex flex-row space-x-2">
					<div class="text-4xl font-bold"><a href={homeHref}>Longpost</a></div>
					<div>
						<button
							class="dart:text-black rounded border bg-black text-sm text-white dark:bg-white"
							disabled={isSubscribed}
						>
							<p class="px-1">
								{#if isSubscribed}plus{:else}<a href="/pricing" target="_blank">upgrade</a>{/if}
							</p>
						</button>
					</div>
				</div>
			</div>
		</div>
		{#if bskyHandle}
			<div class="flex flex-row items-center space-x-4">
				<AvatarPopover {bskyHandle} {isSubscribed} />
			</div>
		{/if}
	</div>
</nav>
