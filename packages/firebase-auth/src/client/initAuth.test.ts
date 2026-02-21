import { afterEach, describe, expect, it, vi } from 'vitest'
import { initAuth } from './index'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
}))
vi.mock('firebase/auth', () => ({
  connectAuthEmulator: vi.fn(),
  getAuth: vi.fn(() => ({})),
}))

describe('initAuth', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns null and logs when config is missing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(initAuth()).toBeNull()
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Firebase Auth not configured'))
    spy.mockRestore()
  })

  it('initializes with passed config', () => {
    const config = {
      apiKey: 'key',
      authDomain: 'domain',
      projectId: 'proj',
      appId: 'app',
    }
    const auth = initAuth({ config })
    expect(auth).toBeDefined()
  })
})
