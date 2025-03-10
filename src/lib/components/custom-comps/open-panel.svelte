<script lang="ts">
	import { openPanel } from '$lib/lib-utils';
	import { onMount } from 'svelte';

	onMount(() => {
		// Make the openPanel instance available globally
		const op = openPanel.init();
		window.op = op;
	});
</script>
