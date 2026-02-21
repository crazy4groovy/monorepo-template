import type { Response } from 'express'
import type { AuthRequest } from 'firebase-auth/admin'

export function getProtected(req: AuthRequest, res: Response): void {
  const user = req.user
  res.json({ uid: user?.uid })
}
