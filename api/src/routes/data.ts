import {Router} from 'express'
import {criarDados, criarDadosPIX, listarDados, listarDadosPIX} from '../controllers/dataController'
import checarCampos from '../middlewares/dataMiddleware'

const routerDados = Router()

routerDados.post('/receber-dados', checarCampos(['data_base', 'uf', 'cliente']), criarDados)
routerDados.post('/receber-dados-pix', checarCampos(['ano_mes', 'sigla_regiao', 'municipio_ibge']), criarDadosPIX)

routerDados.get('/listar-dados', listarDados)
routerDados.get('/listar-dados-pix', listarDadosPIX)


export default routerDados