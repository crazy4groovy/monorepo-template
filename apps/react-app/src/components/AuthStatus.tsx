import { useState } from 'react'
import {
  FIREBASE_UNCONFIGURED_MESSAGE,
  getAuthInstance,
  getFirebaseConfig,
  signInWithEmailAndPassword,
} from 'firebase-auth/client'
import { useAuth } from 'firebase-auth/client/react'

const UNCONFIGURED_BOX_STYLE = {
  padding: '1rem',
  background: '#fff3cd',
  borderRadius: '4px',
  border: '1px solid #ffc107',
} as const

export default function AuthStatus() {
  const firebaseConfigured = !!getFirebaseConfig()

  if (!firebaseConfigured) {
    return (
      <div style={UNCONFIGURED_BOX_STYLE}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>{FIREBASE_UNCONFIGURED_MESSAGE}</p>
      </div>
    )
  }

  return <AuthPanel />
}

function AuthPanel() {
  const { user, loading, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const auth = getAuthInstance()
    if (!auth) return
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    }
  }

  if (loading) return <p>Loading authentication...</p>

  if (user) {
    return (
      <div>
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 300 }}
      onSubmit={handleSignIn}
    >
      <input
        required
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        required
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red', margin: 0, fontSize: '0.85rem' }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  )
}
