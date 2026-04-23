import { Router } from 'express';
import { register, listAll, getById, getByEmail, getByName, getProfile, update, softDelete } from '../controllers/userController';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';
import { validateData } from '../middlewares/dataMiddleware';
import { createUserSchema, updateUserSchema, searchUserSchema, getByEmailSchema, getByIdSchema } from '../schemas/userSchemas';

const router = Router()

router.get('/me', sessionMiddleware, getProfile)

router.get('/', sessionMiddleware, adminOnly, listAll)
router.get('/id/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), getById);
router.get('/search', sessionMiddleware, adminOnly, validateData(searchUserSchema), getByName);
router.get('/email/:email', sessionMiddleware, adminOnly, validateData(getByEmailSchema), getByEmail);

router.post('/', sessionMiddleware, adminOnly, validateData(createUserSchema), register)
router.put('/:id', sessionMiddleware, adminOnly, validateData(updateUserSchema), update)
router.patch('/:id/inactivate', sessionMiddleware, adminOnly, softDelete)

export default router