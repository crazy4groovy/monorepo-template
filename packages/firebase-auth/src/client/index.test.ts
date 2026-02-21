import { describe, expect, it } from 'vitest'
import { getFirebaseConfig } from './index'

describe('getFirebaseConfig', () => {
  it('returns config when all required vars are present', () => {
    const env = {
      VITE_FIREBASE_API_KEY: 'key',
      VITE_FIREBASE_AUTH_DOMAIN: 'domain',
      VITE_FIREBASE_PROJECT_ID: 'proj',
      VITE_FIREBASE_APP_ID: 'app',
    }
    expect(getFirebaseConfig(env)).toEqual({
      apiKey: 'key',
      authDomain: 'domain',
      projectId: 'proj',
      appId: 'app',
    })
  })

  it('supports PUBLIC_ prefix (Astro)', () => {
    const env = {
      PUBLIC_FIREBASE_API_KEY: 'key',
      PUBLIC_FIREBASE_AUTH_DOMAIN: 'domain',
      PUBLIC_FIREBASE_PROJECT_ID: 'proj',
      PUBLIC_FIREBASE_APP_ID: 'app',
    }
    expect(getFirebaseConfig(env)).toEqual({
      apiKey: 'key',
      authDomain: 'domain',
      projectId: 'proj',
      appId: 'app',
    })
  })

  it('returns null when required vars are missing', () => {
    expect(getFirebaseConfig({})).toBeNull()
    expect(getFirebaseConfig({ VITE_FIREBASE_API_KEY: 'key' })).toBeNull()
  })
})
