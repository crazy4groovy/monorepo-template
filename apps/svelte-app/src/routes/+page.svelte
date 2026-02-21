<script lang="ts">
  import { add, capitalize, formatCurrency } from 'package1'
  import {
    FIREBASE_UNCONFIGURED_MESSAGE,
    getAuthInstance,
    getFirebaseConfig,
    signInWithEmailAndPassword,
    signOut,
  } from 'firebase-auth/client'
  import { authLoading, authStore } from 'firebase-auth/client/svelte'

  const appName = 'Svelte App'
  const apiUrl = 'http://localhost:3000'
  const env = 'development'
  const firebaseConfigured = !!getFirebaseConfig()

  let email = $state('')
  let password = $state('')
  let authError = $state('')

  async function handleSignIn(e: Event) {
    e.preventDefault()
    authError = ''
    const auth = getAuthInstance()
    if (!auth) return
    try {
      await signInWithEmailAndPassword(auth, email, password)
      email = ''
      password = ''
    } catch (err) {
      authError = err instanceof Error ? err.message : 'Sign-in failed'
    }
  }

  async function handleSignOut() {
    const auth = getAuthInstance()
    if (!auth) return
    await signOut(auth)
  }
</script>

<h1>{appName}</h1>
<p>Welcome to the Svelte app in the monorepo!</p>

<div
  style="
    margin-top: 1rem;
    padding: 1rem;
    background: #eef6ff;
    border-radius: 4px;
    border: 1px solid #b3d4fc;
  "
>
  <p style="margin-top: 0; font-weight: bold">Firebase Auth</p>
  {#if !firebaseConfigured}
    <div
      style="
        padding: 1rem;
        background: #fff3cd;
        border-radius: 4px;
        border: 1px solid #ffc107;
      "
    >
      <p style="margin: 0; font-size: 0.9rem">{FIREBASE_UNCONFIGURED_MESSAGE}</p>
    </div>
  {:else if $authLoading}
    <p>Loading authentication...</p>
  {:else if $authStore}
    <p>Signed in as <strong>{$authStore.email}</strong></p>
    <button onclick={handleSignOut}>Sign Out</button>
  {:else}
    <form
      onsubmit={handleSignIn}
      style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 300px"
    >
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      {#if authError}
        <p style="color: red; margin: 0; font-size: 0.85rem">{authError}</p>
      {/if}
      <button type="submit">Sign In</button>
    </form>
  {/if}
</div>

<div
  style="
		margin-top: 1rem;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 4px;
	"
>
  <p style="margin-top: 0; font-weight: bold">Environment Variables:</p>
  <ul style="margin-bottom: 1rem">
    <li>Environment: {env}</li>
    <li>API URL: {apiUrl}</li>
  </ul>
  <p style="font-weight: bold">Using package1 utilities:</p>
  <ul>
    <li>Capitalize: {capitalize('hello world')}</li>
    <li>Add: 5 + 3 = {add(5, 3)}</li>
    <li>Currency: {formatCurrency(1234.56)}</li>
  </ul>
</div>
