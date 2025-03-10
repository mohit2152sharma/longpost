<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Footer from '$lib/components/custom-comps/footer.svelte';
	import { onMount } from 'svelte';
	import OpenPanel from '$lib/components/custom-comps/open-panel.svelte';

	onMount(() => {
		const footer = document.getElementById('footer');
		if (footer) {
			document.documentElement.style.setProperty('--footer-height', `${footer.offsetHeight}px`);
		}
	});
</script>

<OpenPanel />
<div class="flex flex-col justify-end">
	{@render children()}
	<Footer />
</div>
