import type { Request, Response } from 'express'
import { add, capitalize, formatCurrency } from 'package1'

const APP_NAME = process.env.APP_NAME || 'Express Service'
const API_VERSION = process.env.API_VERSION || 'v1'

export function getHome(_req: Request, res: Response): void {
  res.json({
    message: `Hello from ${APP_NAME}!`,
    version: API_VERSION,
    example: {
      capitalize: capitalize('hello world'),
      add: add(10, 20),
      currency: formatCurrency(99.99),
    },
  })
}

export function getHealth(_req: Request, res: Response): void {
  res.json({ status: 'ok' })
}
