/**
 * React bindings for Firebase Auth.
 * Use useAuth() in React or Astro (with React) apps.
 * @module firebase-auth/client/react
 */

import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { getAuthInstance, initAuth, onAuthStateChanged, signOut } from './index'

export interface UseAuthResult {
  /** Current user or null if signed out */
  user: User | null
  /** True while auth state is loading */
  loading: boolean
  /** Last auth error, if any */
  error: Error | null
  /** Sign out the current user */
  signOut: () => Promise<void>
  /** Get ID token for API calls (Authorization: Bearer &lt;token&gt;) */
  getIdToken: () => Promise<string | null>
}

/**
 * React hook for Firebase Auth state.
 * Call initAuth() once at app root before using.
 *
 * @returns { user, loading, error, signOut, getIdToken }
 *
 * @example
 * function App() {
 *   const { user, loading, signOut } = useAuth()
 *   if (loading) return <Spinner />
 *   if (!user) return <LoginPage />
 *   return <Dashboard user={user} onSignOut={signOut} />
 * }
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const auth = getAuthInstance() ?? initAuth()
    if (!auth) {
      queueMicrotask(() => {
        setUser(null)
        setLoading(false)
      })
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      setError(null)
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    setError(null)
    const auth = getAuthInstance()
    if (auth) {
      try {
        await signOut(auth)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      }
    }
  }

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null
    try {
      return await user.getIdToken()
    } catch {
      return null
    }
  }

  return {
    user,
    loading,
    error,
    signOut: handleSignOut,
    getIdToken,
  }
}
