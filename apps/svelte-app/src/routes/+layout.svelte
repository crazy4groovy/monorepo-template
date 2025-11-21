<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	// Disable SSR - client-only SPA
	export const ssr = false;

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
