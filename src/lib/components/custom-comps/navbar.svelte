<script lang="ts">
	import AvatarPopover from './avatar-popover.svelte';

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
					<!-- TODO: Disabling subscription check as Stripe doesn't work in India -->
					<!-- <div> -->
					<!-- 	<p -->
					<!-- 		class="dart:text-black rounded border bg-black px-1 text-sm text-white dark:bg-white" -->
					<!-- 	> -->
					<!-- 		{#if isSubscribed}plus{:else}<a href="/pricing" target="_blank">upgrade</a>{/if} -->
					<!-- 	</p> -->
					<!-- </div> -->
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
