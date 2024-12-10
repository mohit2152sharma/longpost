<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	export let submitting: boolean = false;
	export let type: string = 'submit';
	export let cls: string = '';
	export let variant: string = 'default';
	export let animation: string = 'animate-spin';
	export let buttonTitle: string = 'Login';
</script>

<Button {type} class={cls} {variant}>
	{#if submitting}
		<LoaderCircle class={animation} />
	{:else}
		{buttonTitle}
	{/if}
</Button>
