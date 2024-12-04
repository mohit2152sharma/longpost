<script lang="ts">
	import LoginPage from "$lib/components/login-page.svelte";
	import type { PageData } from './$types' 
	import type { LoginCredentialsSchemaType } from "$lib/server/bsky/types";

	export let data: PageData & { form: LoginCredentialsSchemaType }

</script>

<LoginPage {data} />
