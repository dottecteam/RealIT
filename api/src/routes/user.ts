import {Router} from 'express'
import {register, userData, listarUsuarios} from '../controllers/userController'
import {authMiddleWare} from '../middlewares/authMiddleware'

const routerUser = Router()

routerUser.post('/registrar', register)
routerUser.get('/me', authMiddleWare, userData)
routerUser.get('/listar-usuarios', listarUsuarios)

export default routerUser