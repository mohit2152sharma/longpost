<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let userName: string = 'BS';

	if (userName.length > 2) {
		userName = userName.slice(0, 2).toUpperCase();
	} else {
		userName = userName.toUpperCase();
	}
</script>

<Avatar.Root>
	<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
	<Avatar.Fallback>{userName}</Avatar.Fallback>
</Avatar.Root>
