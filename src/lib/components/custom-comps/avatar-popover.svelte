<script lang="ts">
	import Avatar from './avatar.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { PUBLIC_STRIPE_CONSOLE_URL } from '$env/static/public';
	import { createBskyProfileUrl } from '$lib/lib-utils';

	export let bskyHandle: string;
	export let isSubscribed: boolean;
	const bskyProfileUrl = createBskyProfileUrl(bskyHandle);
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Avatar userName={bskyHandle} /></Tooltip.Trigger
		>
		<Tooltip.Content class="mr-10 bg-gray-100 text-black">
			<div class="flex flex-col space-y-4 text-sm">
				<div class="">
					<a href={bskyProfileUrl} target="_blank" rel="noreferrer">Bluesky Profile</a>
				</div>
				{#if isSubscribed}
					<div class="">
						<a href={PUBLIC_STRIPE_CONSOLE_URL} target="_blank">Billing</a>
					</div>
				{/if}
				<!-- TODO: Enable help page when enough content is there -->
				<!-- <div> -->
				<!-- 	<a href="/help" target="_blank">Help</a> -->
				<!-- </div> -->
				<div class="">
					<form method="POST" action="/login?/logout">
						<button type="submit">Logout</button>
					</form>
				</div>
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
