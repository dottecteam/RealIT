import { Router } from 'express';
import * as dataController from '../controllers/dataWriteController';
import * as dataRead from '../controllers/dataReadController';
import { validateData } from '../middlewares/dataMiddleware';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';
import * as schemas from '../schemas/dataSchemas';
import { z } from 'zod';

const routerData = Router();

routerData.post('/import-monthly',sessionMiddleware,adminOnly,validateData(schemas.masterDataSchema),dataController.importMonthlyData);
routerData.post('/credit-risk',sessionMiddleware,adminOnly,validateData(z.object({ body: schemas.creditRiskArray })),dataController.createCreditRisk);
routerData.post('/inclusion-expansion',sessionMiddleware,adminOnly,validateData(z.object({ body: schemas.inclusionExpansionArray })),dataController.createInclusionExpansion);
routerData.post('/pix-structure',sessionMiddleware,adminOnly,validateData(z.object({ body: schemas.pixStructureArray })),dataController.createPixStructure);
routerData.post('/ibge-structure',sessionMiddleware,adminOnly,validateData(z.object({ body: schemas.ibgeStructureArray })),dataController.createIBGEStructure);


routerData.get('/calculate-scores', sessionMiddleware, validateData(schemas.calculateScoresQuerySchema), dataRead.calculateDashboardScores);
routerData.get('/region-summary', sessionMiddleware, validateData(schemas.regionSummaryQuerySchema), dataRead.getRegionSummary);
routerData.get('/uf-summary', sessionMiddleware, validateData(schemas.ufSummaryQuerySchema), dataRead.getUFSummary);

routerData.get('/credit-risk', sessionMiddleware, dataRead.getCreditRisk);
routerData.get('/inclusion-expansion', sessionMiddleware, dataRead.getInclusionExpansion);
routerData.get('/pix-structure', sessionMiddleware, dataRead.getPixStructure);
routerData.get('/ibge-structure', sessionMiddleware, dataRead.getIBGEStructure);

export default routerData;