import {Router} from 'express'
import { login, logout } from '../controllers/authController'

const routerAuth = Router()

routerAuth.post('/login', login)
routerAuth.post('/logout', logout)

export default routerAuth