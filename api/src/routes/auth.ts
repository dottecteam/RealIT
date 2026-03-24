import {Router} from 'express'
import {register, login, userData, listarUsuarios} from '../controllers/authController'
import {authMiddleWare} from '../middlewares/authMiddleware'

const routerUser = Router()

routerUser.post('/registrar', register)
routerUser.post('/login', login)

routerUser.get('/me', authMiddleWare, userData)
routerUser.get('/listar-usuarios', listarUsuarios)

export default routerUser