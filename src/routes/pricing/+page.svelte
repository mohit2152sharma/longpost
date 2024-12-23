<script lang="ts">
	import Navbar from '$lib/components/custom-comps/navbar.svelte';
	import type { PageData } from '../$types';
	import { env as publicEnv } from '$env/dynamic/public';
	import { PRICING_TABLE_ID_DEV, PRICING_TABLE_PUBLISHABLE_KEY_DEV } from '$lib/constants';
	import { PRICING_TABLE_ID_PROD, PRICING_TABLE_PUBLISHABLE_KEY_PROD } from '$lib/constants';

	let PRICING_TABLE_ID: string;
	let PRICING_TABLE_PUBLISHABLE_KEY: string;
	if (publicEnv.PUBLIC_MY_ENV === 'prod') {
		PRICING_TABLE_ID = PRICING_TABLE_ID_PROD;
		PRICING_TABLE_PUBLISHABLE_KEY = PRICING_TABLE_PUBLISHABLE_KEY_PROD;
	} else {
		PRICING_TABLE_ID = PRICING_TABLE_ID_DEV;
		PRICING_TABLE_PUBLISHABLE_KEY = PRICING_TABLE_PUBLISHABLE_KEY_DEV;
	}

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
			pricing-table-id={PRICING_TABLE_ID}
			publishable-key={PRICING_TABLE_PUBLISHABLE_KEY}
			client-reference-id={userId}
		>
		</stripe-pricing-table>
	</div>
</div>
