<script lang="ts">
	import LoginForm from "$lib/components/login-form.svelte";
	import type { PageData } from "../../routes/$types";
	import type { LoginCredentialsSchemaType } from "$lib/bsky/types";

	export let data: PageData & { form: LoginCredentialsSchemaType }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm {data} />
</div>
