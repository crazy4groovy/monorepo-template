/**
 * Svelte bindings for Firebase Auth.
 * Use authStore and authLoading in Svelte apps.
 * @module firebase-auth/client/svelte
 */

import { writable } from 'svelte/store'
import type { User } from 'firebase/auth'
import { getAuthInstance, initAuth, onAuthStateChanged } from './index'

/** Store holding the current Firebase user or null if signed out */
export const authStore = writable<User | null>(null)

/** Derived store: true while auth state is loading */
export const authLoading = writable(true)

let initialized = false

/**
 * Initializes auth and subscribes authStore to Firebase auth state.
 * Call once at app startup (e.g. in root layout or +layout.svelte).
 *
 * @example
 * // +layout.svelte
 * import { initAuthForSvelte } from 'firebase-auth/client/svelte'
 * initAuthForSvelte()
 */
export function initAuthForSvelte(): void {
  if (initialized) return
  initialized = true

  const auth = getAuthInstance() ?? initAuth()
  if (!auth) {
    authStore.set(null)
    authLoading.set(false)
    return
  }
  onAuthStateChanged(auth, (user) => {
    authStore.set(user)
    authLoading.set(false)
  })
}
