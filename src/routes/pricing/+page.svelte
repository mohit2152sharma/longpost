<script lang="ts">
	import Navbar from '$lib/components/custom-comps/navbar.svelte';
	import type { PageData } from '../$types';

	export let data: PageData & { userId: string; bskyHandle: string; isSubscribed: boolean };
	const userId = data.userId;
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<div class="flex flex-col justify-end">
	<Navbar bskyHandle={data.bskyHandle} isSubscribed={data.isSubscribed} />
	<div class="m-10">
		<stripe-pricing-table
			pricing-table-id="prctbl_1QV9iRSHacannOAHVM0IBblQ"
			publishable-key="pk_test_51QV9Y4SHacannOAHx9HxPgZr1xQE0iMd9qgBuYumXcKyTZvzMqGBIFmGmpf1rcfcJImr2kx4pdcPI4i09bwExvFX00ixuYVEhp"
			client-reference-id={userId}
		>
		</stripe-pricing-table>
	</div>
</div>
