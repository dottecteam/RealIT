import {Router} from 'express'
import { login, logout } from '../controllers/authController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'

const routerAuth = Router()

routerAuth.post('/login', login)
routerAuth.post('/logout', sessionMiddleware, logout)

export default routerAuth