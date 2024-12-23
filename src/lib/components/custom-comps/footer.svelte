<script lang="ts">
 import BlueskyIcon from './bluesky-icon.svelte'
 import { BLUESKY_LOGO_HREF } from '$lib/constants'
 import GithubIcon from './github-icon.svelte'
 import { GITHUB_LOGO_HREF } from '$lib/constants'
</script>

<footer id="footer">
	<div class="mb-2 mt-4">
		<div class="flex flex-row items-center justify-center space-x-4">
			<BlueskyIcon href={BLUESKY_LOGO_HREF} width={30} height={30} />
			<GithubIcon href={GITHUB_LOGO_HREF} width={30} height={30} />
		</div>
	</div>
</footer>
