<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Analytics from '$lib/components/custom-comps/analytics.svelte';
	import { GOOGLE_MEASUREMENT_ID } from '$lib/constants';
	import Footer from '$lib/components/custom-comps/footer.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const footer = document.getElementById('footer');
		if (footer) {
			document.documentElement.style.setProperty('--footer-height', `${footer.offsetHeight}px`);
		}
	});
</script>

<Analytics measurementId={GOOGLE_MEASUREMENT_ID} />
<div class="flex flex-col justify-end">
	{@render children()}
	<Footer />
</div>
