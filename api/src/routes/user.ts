import { Router } from 'express'
import { register, listAll, getProfile, update, softDelete } from '../controllers/userController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import { adminOnly } from '../middlewares/roleMiddleware'

const router = Router()

router.get('/me', sessionMiddleware, getProfile)

router.get('/', sessionMiddleware, adminOnly, listAll)
router.post('/', sessionMiddleware, adminOnly, register)
router.put('/:id', sessionMiddleware, adminOnly, update)
router.patch('/:id/inactivate', sessionMiddleware, adminOnly, softDelete)

export default router