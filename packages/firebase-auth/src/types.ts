/**
 * Shared types for firebase-auth package.
 * @module types
 */

/**
 * Firebase client configuration from Firebase Console.
 * Safe to expose in client bundles.
 * @see https://firebase.google.com/docs/web/learn-more#config-object
 */
export interface FirebaseClientConfig {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
  storageBucket?: string
  messagingSenderId?: string
  measurementId?: string
}

/**
 * Options for initializing client auth.
 * Pass config to override env-based config (useful for testing).
 */
export interface InitAuthOptions {
  /** Override config from env. Useful for tests or custom config. */
  config?: FirebaseClientConfig
}
