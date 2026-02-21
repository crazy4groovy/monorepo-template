import { FIREBASE_UNCONFIGURED_LABEL, getFirebaseConfig } from 'firebase-auth/client'
import { useAuth } from 'firebase-auth/client/react'

export function AuthNavStatus() {
  const firebaseConfigured = !!getFirebaseConfig()
  const { user, loading } = useAuth()

  if (!firebaseConfigured) {
    return <span>{FIREBASE_UNCONFIGURED_LABEL}</span>
  }
  if (loading) {
    return <span>Checking auth...</span>
  }
  if (user) {
    return <span>{user.email ?? 'Signed in'}</span>
  }
  return <span>Not signed in</span>
}
