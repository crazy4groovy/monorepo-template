/**
 * Firebase Auth client SDK - initialization and config from env.
 * Use in React, Svelte, or Astro web apps.
 * @module firebase-auth/client
 */

import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import type { FirebaseClientConfig, InitAuthOptions } from '../types'

let authInstance: Auth | null = null
let appInstance: ReturnType<typeof initializeApp> | null = null

/**
 * Reads Firebase config from environment.
 * Supports VITE_* (Vite/React/Svelte) and PUBLIC_* (Astro) prefixes.
 *
 * @param env - Optional env object (defaults to import.meta.env when available)
 * @returns Firebase config or null if required vars missing
 *
 * @example
 * const config = getFirebaseConfig()
 * if (config) initAuth({ config })
 */
export function getFirebaseConfig(
  env?: Record<string, string | undefined>
): FirebaseClientConfig | null {
  const metaEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      : undefined
  const e = env ?? metaEnv ?? {}
  const apiKey = (e.VITE_FIREBASE_API_KEY ?? e.PUBLIC_FIREBASE_API_KEY) as string | undefined
  const authDomain = (e.VITE_FIREBASE_AUTH_DOMAIN ?? e.PUBLIC_FIREBASE_AUTH_DOMAIN) as
    | string
    | undefined
  const projectId = (e.VITE_FIREBASE_PROJECT_ID ?? e.PUBLIC_FIREBASE_PROJECT_ID) as
    | string
    | undefined
  const appId = (e.VITE_FIREBASE_APP_ID ?? e.PUBLIC_FIREBASE_APP_ID) as string | undefined

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    storageBucket: (e.VITE_FIREBASE_STORAGE_BUCKET ?? e.PUBLIC_FIREBASE_STORAGE_BUCKET) as
      | string
      | undefined,
    messagingSenderId: (e.VITE_FIREBASE_MESSAGING_SENDER_ID ??
      e.PUBLIC_FIREBASE_MESSAGING_SENDER_ID) as string | undefined,
    measurementId: (e.VITE_FIREBASE_MEASUREMENT_ID ?? e.PUBLIC_FIREBASE_MEASUREMENT_ID) as
      | string
      | undefined,
  }
}

const CLIENT_CONFIG_MSG =
  'Firebase Auth not configured. Set VITE_FIREBASE_* or PUBLIC_FIREBASE_* env vars. See packages/firebase-auth/.env.sample'

/** User-facing message when Firebase Auth is not configured. Use in UI. */
export const FIREBASE_UNCONFIGURED_MESSAGE =
  'Firebase not configured. Add VITE_FIREBASE_* or PUBLIC_FIREBASE_* env vars. See packages/firebase-auth/.env.sample'

/** Short label for nav/compact display when not configured. */
export const FIREBASE_UNCONFIGURED_LABEL = 'Firebase not configured'

/**
 * Initializes Firebase Auth. Call once at app startup.
 * Reads config from env (VITE_* or PUBLIC_*) unless overridden.
 * When config is missing, logs a console.error and returns null (for gradual implementation).
 *
 * @param options - Optional config override
 * @returns Auth instance or null if not configured
 *
 * @example
 * import { initAuth } from 'firebase-auth/client'
 * const auth = initAuth()
 * if (auth) { ... }
 */
export function initAuth(options?: InitAuthOptions): Auth | null {
  if (authInstance) {
    return authInstance
  }

  const config = options?.config ?? getFirebaseConfig()
  if (!config) {
    console.error(`[firebase-auth] ${CLIENT_CONFIG_MSG}`)
    return null
  }

  appInstance = initializeApp(config)
  authInstance = getAuth(appInstance)

  const metaEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      : undefined
  const emulatorHost = metaEnv
    ? (metaEnv.VITE_FIREBASE_EMULATOR_HOST ?? metaEnv.PUBLIC_FIREBASE_EMULATOR_HOST)
    : undefined
  if (emulatorHost) {
    connectAuthEmulator(authInstance, `http://${emulatorHost}`, { disableWarnings: true })
  }

  return authInstance
}

/**
 * Returns the Auth instance. Must call initAuth() first.
 *
 * @returns Auth instance or null if not initialized
 *
 * @example
 * const auth = getAuth()
 * if (auth) signOut(auth)
 */
export function getAuthInstance(): Auth | null {
  return authInstance
}

// Re-export commonly used Firebase Auth functions for convenience
export {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
