import {Router} from 'express'
import {criarDados, criarDadosPIX, criarDadosTaxaEscolarizacao, criarDadosCresPopulacional, criarDadosPopAbsoluta, criarDadosBonusDemografico} from '../controllers/dataController'
import {listarDados, listarDadosPIX, listarTaxaEscolarizacao, listarCrescimentoPopulacional, listarPopAbsoluta, listarBonusDemografico} from '../controllers/dataController'
import checarCampos from '../middlewares/dataMiddleware'

const routerDados = Router()

routerDados.post('/receber-dados', checarCampos(['data_base', 'uf', 'cliente']), criarDados)
routerDados.post('/receber-dados-pix', checarCampos(['ano_mes', 'sigla_regiao', 'municipio_ibge']), criarDadosPIX)
routerDados.post('/receber-taxa', checarCampos(['nn', 'v', 'd5n']), criarDadosTaxaEscolarizacao)
routerDados.post('/receber-crescimento', checarCampos(['d1n', 'v', 'd2n']), criarDadosCresPopulacional)
routerDados.post('/receber-populacao', checarCampos(['d1n', 'v', 'd2n']), criarDadosPopAbsoluta)
routerDados.post('/receber-bonus', checarCampos(['brasilGrandeRegiaoUf', 'total', 'xy_anos']), criarDadosBonusDemografico)

routerDados.get('/listar-dados', listarDados)
routerDados.get('/listar-dados-pix', listarDadosPIX)
routerDados.get('/listar-taxa', listarTaxaEscolarizacao)
routerDados.get('/listar-crescimento', listarCrescimentoPopulacional)
routerDados.get('/listar-populacao', listarPopAbsoluta)
routerDados.get('/listar-bonus', listarBonusDemografico)


export default routerDados