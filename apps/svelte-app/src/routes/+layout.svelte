<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import { FIREBASE_UNCONFIGURED_LABEL, getFirebaseConfig } from 'firebase-auth/client'
  import { authLoading, authStore, initAuthForSvelte } from 'firebase-auth/client/svelte'

  initAuthForSvelte()
  const firebaseConfigured = !!getFirebaseConfig()

  let { children } = $props()
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
    <span style="float: right; font-size: 0.9rem; color: #666">
      {#if !firebaseConfigured}
        {FIREBASE_UNCONFIGURED_LABEL}
      {:else if $authLoading}
        Checking auth...
      {:else if $authStore}
        {$authStore.email ?? 'Signed in'}
      {:else}
        Not signed in
      {/if}
    </span>
  </nav>
  {@render children()}
</div>
