import {Router} from 'express'
import {register, login, userData} from '../controllers/authController'
import {authMiddleWare} from '../middlewares/authMiddleware'

const router = Router()

router.post('/registrar', register)
router.post('/login', login)
router.get('/me', authMiddleWare, userData)

export default router