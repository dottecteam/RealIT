import {Router} from 'express'
import { login, logout } from '../controllers/authController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import { authLimiter } from '../middlewares/rateLimiter';
import { validateData } from '../middlewares/dataMiddleware';
import { loginSchema } from '../schemas/authSchemas';

const routerAuth = Router()

routerAuth.post('/login', authLimiter, validateData(loginSchema), login)
routerAuth.post('/logout', sessionMiddleware, logout)

export default routerAuth