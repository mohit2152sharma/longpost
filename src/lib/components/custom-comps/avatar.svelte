<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let userName: string = 'BS';
	let avatar: string

	if (userName.length > 2) {
		avatar = userName.slice(0, 2).toUpperCase();
	} else {
		avatar = userName.toUpperCase();
	}
</script>

<Avatar.Root>
	<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
	<Avatar.Fallback>{avatar}</Avatar.Fallback>
</Avatar.Root>
