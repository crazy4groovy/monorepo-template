import type { IRouter } from 'express'
import { Router } from 'express'
import { authMiddleware } from 'firebase-auth/admin'
import * as homeController from '../controllers/home.controller.js'
import * as authController from '../controllers/auth.controller.js'
import todosRoutes from './todos.routes.js'

const router: IRouter = Router()

router.get('/', homeController.getHome)
router.get('/health', homeController.getHealth)
router.get('/api/protected', authMiddleware, authController.getProtected)
router.use('/api/todos', todosRoutes)

export default router
