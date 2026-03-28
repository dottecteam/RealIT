import {Router} from 'express';
import {criarDados, criarDadosPIX, criarDadosTaxaEscolarizacao, 
  criarDadosCresPopulacional, criarDadosPopAbsoluta, criarDadosBonusDemografico,
  listarDados, listarDadosPIX, listarTaxaEscolarizacao, 
  listarCrescimentoPopulacional, listarPopAbsoluta, listarBonusDemografico} from '../controllers/dataController';

import { validateData } from '../middlewares/dataMiddleware';
import {dadosSchema, dadosPixSchema, taxaEscolarizacaoSchema, 
  crescimentoPopulacionalSchema, populacaoAbsolutaSchema, bonusDemograficoSchema} from '../schemas/validationSchemas';

const routerDados = Router();

routerDados.post('/receber-dados', validateData(dadosSchema), criarDados);
routerDados.post('/receber-dados-pix', validateData(dadosPixSchema), criarDadosPIX);
routerDados.post('/receber-taxa', validateData(taxaEscolarizacaoSchema), criarDadosTaxaEscolarizacao);
routerDados.post('/receber-crescimento', validateData(crescimentoPopulacionalSchema), criarDadosCresPopulacional);
routerDados.post('/receber-populacao', validateData(populacaoAbsolutaSchema), criarDadosPopAbsoluta);
routerDados.post('/receber-bonus', validateData(bonusDemograficoSchema), criarDadosBonusDemografico);

routerDados.get('/listar-dados', listarDados);
routerDados.get('/listar-dados-pix', listarDadosPIX);
routerDados.get('/listar-taxa', listarTaxaEscolarizacao);
routerDados.get('/listar-crescimento', listarCrescimentoPopulacional);
routerDados.get('/listar-populacao', listarPopAbsoluta);
routerDados.get('/listar-bonus', listarBonusDemografico);

export default routerDados;