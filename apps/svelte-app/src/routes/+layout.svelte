<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	style="
		padding: 2rem;
		font-family: system-ui;
	"
>
	<nav
		style="
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 1px solid #e0e0e0;
		"
	>
		<a
			href="/"
			style="
				margin-right: 1rem;
				text-decoration: none;
				color: #007bff;
			"
		>
			Home
		</a>
		<a
			href="/about"
			style="
				text-decoration: none;
				color: #007bff;
			"
		>
			About
		</a>
	</nav>
	{@render children()}
</div>
