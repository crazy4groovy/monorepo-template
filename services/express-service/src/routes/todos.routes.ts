import type { IRouter } from 'express'
import { Router } from 'express'
import * as todosController from '../controllers/todos.controller.js'

const router: IRouter = Router()

router.get('/', todosController.list)
router.get('/:id', todosController.getOne)
router.post('/', todosController.create)
router.patch('/:id', todosController.update)
router.delete('/:id', todosController.remove)

export default router
