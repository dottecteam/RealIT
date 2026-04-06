import {Router} from 'express';
import { criarDadosScore, criarDadosMediaRegiao, listarDados } from '../controllers/scoreController';
import { validateData } from '../middlewares/dataMiddleware';
import { scoreUfArray, mediaRegiaoArray } from '../schemas/validationSchemas';

const routerDados = Router();

// routerDados.post('/receber-dados', validateData(dadosSchema), criarDados);
// routerDados.post('/receber-dados-pix', validateData(dadosPixSchema), criarDadosPIX);
// routerDados.post('/receber-taxa', validateData(taxaEscolarizacaoSchema), criarDadosTaxaEscolarizacao);
// routerDados.post('/receber-crescimento', validateData(crescimentoPopulacionalSchema), criarDadosCresPopulacional);
// routerDados.post('/receber-populacao', validateData(populacaoAbsolutaSchema), criarDadosPopAbsoluta);
// routerDados.post('/receber-bonus', validateData(bonusDemograficoSchema), criarDadosBonusDemografico);
// routerDados.post('/receber-risco', criarDadosRiscoCredito);
// routerDados.post('/receber-inclusao', validateData(inclusaoDemograficaSchema), criarDadosInclusaoDemografica);

// routerDados.get('/listar-dados', listarDados);
// routerDados.get('/listar-dados-pix', listarDadosPIX);
// routerDados.get('/listar-taxa', listarTaxaEscolarizacao);
// routerDados.get('/listar-crescimento', listarCrescimentoPopulacional);
// routerDados.get('/listar-populacao', listarPopAbsoluta);
// routerDados.get('/listar-bonus', listarBonusDemografico);
// routerDados.get('/listar-risco', listarRiscoCredito);
// routerDados.get('/listar-inclusao', listarInclusaoDemografica);


// Dados Score
routerDados.post('/receber-scoreUf', validateData(scoreUfArray), criarDadosScore)

// Dados MediaRegiao
routerDados.post('/receber-mediaRegiao', validateData(mediaRegiaoArray), criarDadosMediaRegiao)

// Listar dados gerais
routerDados.get('/listar-dados', listarDados)



export default routerDados;