import {Router} from 'express'
import {criarDados, criarDadosPIX, listarDados, listarDadosPIX} from '../controllers/dataController'

const routerDados = Router()

routerDados.post('/receber-dados', criarDados)
routerDados.post('/receber-dados-pix', criarDadosPIX)

routerDados.get('/listar-dados', listarDados)
routerDados.get('/listar-dados-pix', listarDadosPIX)


export default routerDados