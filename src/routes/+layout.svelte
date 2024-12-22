<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Analytics from '$lib/components/custom-comps/analytics.svelte';
	import { GOOGLE_MEASUREMENT_ID } from '$lib/constants';
</script>

<Analytics measurementId={GOOGLE_MEASUREMENT_ID} />
{@render children()}
