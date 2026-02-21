/**
 * Firebase Admin Auth - token verification and Express middleware.
 * Use in Node.js backends (e.g. Express).
 * @module firebase-auth/admin
 */

import type { NextFunction, Request, Response } from 'express'
import { cert, initializeApp } from 'firebase-admin/app'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'

let adminAuthInstance: ReturnType<typeof getAdminAuth> | null = null

/**
 * Extended Express Request with decoded Firebase user.
 */
export interface AuthRequest extends Request {
  user?: DecodedIdToken
}

const ADMIN_CONFIG_MSG =
  'Firebase Admin Auth not configured. Set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON. See packages/firebase-auth/.env.sample'

/**
 * Initializes Firebase Admin SDK. Call once at server startup.
 * Reads config from env: GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.
 * When not configured, logs a console.error and returns null (for gradual implementation).
 *
 * @returns Admin Auth instance or null if not configured
 *
 * @example
 * import { initAdminAuth } from 'firebase-auth/admin'
 * initAdminAuth()
 */
export function initAdminAuth(): ReturnType<typeof getAdminAuth> | null {
  if (adminAuthInstance) return adminAuthInstance

  const projectId = process.env.FIREBASE_PROJECT_ID
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const hasCredentials = serviceAccountJson || process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!projectId || !hasCredentials) {
    console.error(`[firebase-auth] ${ADMIN_CONFIG_MSG}`)
    return null
  }

  let credential: ReturnType<typeof cert> | undefined
  if (serviceAccountJson) {
    try {
      const decoded = Buffer.from(serviceAccountJson, 'base64').toString('utf-8')
      credential = cert(JSON.parse(decoded) as object)
    } catch {
      credential = cert(JSON.parse(serviceAccountJson) as object)
    }
  }

  const app = initializeApp({
    projectId,
    credential,
  })

  adminAuthInstance = getAdminAuth(app)

  // Admin SDK connects to emulator automatically when FIREBASE_AUTH_EMULATOR_HOST is set
  return adminAuthInstance
}

/**
 * Returns the Admin Auth instance. Must call initAdminAuth() first.
 */
export function getAdminAuthInstance(): ReturnType<typeof getAdminAuth> | null {
  return adminAuthInstance
}

/**
 * Verifies a Firebase ID token.
 *
 * @param token - Bearer token (with or without "Bearer " prefix)
 * @returns Decoded claims or null if invalid or auth not configured
 *
 * @example
 * const decoded = await verifyIdToken(req.headers.authorization?.replace('Bearer ', ''))
 */
export async function verifyIdToken(token: string | undefined): Promise<DecodedIdToken | null> {
  if (!token) return null
  const auth = adminAuthInstance ?? initAdminAuth()
  if (!auth) return null
  const clean = token.startsWith('Bearer ') ? token.slice(7) : token
  try {
    return await auth.verifyIdToken(clean)
  } catch {
    return null
  }
}

/**
 * Express middleware that verifies Firebase ID token and attaches req.user.
 * Sends 401 if token is missing or invalid, 503 if auth is not configured.
 *
 * @example
 * app.use('/api/protected', authMiddleware, (req, res) => {
 *   console.log((req as AuthRequest).user?.uid)
 * })
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const auth = adminAuthInstance ?? initAdminAuth()
  if (!auth) {
    res.status(503).json({ error: 'Firebase Admin Auth not configured' })
    return
  }
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : header

  if (!token) {
    res.status(401).json({ error: 'Missing Authorization header' })
    return
  }

  auth
    .verifyIdToken(token)
    .then((decoded) => {
      const authReq = req as AuthRequest
      authReq.user = decoded
      next()
    })
    .catch(() => {
      res.status(401).json({ error: 'Invalid or expired token' })
    })
}
