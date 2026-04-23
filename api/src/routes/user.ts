import { Router } from 'express'
import { register, listAll, getById, getProfile, update, softDelete } from '../controllers/userController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import { adminOnly } from '../middlewares/roleMiddleware'
import { validateData } from '../middlewares/dataMiddleware' // Importe o middleware
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas' // Importe os schemas

const router = Router()

router.get('/me', sessionMiddleware, getProfile)

router.get('/', sessionMiddleware, adminOnly, listAll)
router.post('/', sessionMiddleware, adminOnly, validateData(createUserSchema), register)
router.get('/:id', sessionMiddleware, adminOnly, getById);
router.put('/:id', sessionMiddleware, adminOnly, validateData(updateUserSchema), update)
router.patch('/:id/inactivate', sessionMiddleware, adminOnly, softDelete)

export default router