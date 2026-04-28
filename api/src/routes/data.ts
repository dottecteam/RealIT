import { Router } from 'express';
import * as dataController from '../controllers/dataController';
import { validateData } from '../middlewares/dataMiddleware';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';
import * as schemas from '../schemas/dataSchemas';
import { z } from 'zod';

const routerData = Router();

routerData.post(
  '/import-monthly',
  sessionMiddleware,
  adminOnly,
  validateData(schemas.masterDataSchema),
  dataController.importMonthlyData
);

routerData.post(
  '/credit-risk',
  sessionMiddleware,
  adminOnly,
  validateData(z.object({ body: schemas.creditRiskArray })),
  dataController.createCreditRisk
);

routerData.post(
  '/inclusion-expansion',
  sessionMiddleware,
  adminOnly,
  validateData(z.object({ body: schemas.inclusionExpansionArray })),
  dataController.createInclusionExpansion
);

routerData.post(
  '/pix-structure',
  sessionMiddleware,
  adminOnly,
  validateData(z.object({ body: schemas.pixStructureArray })),
  dataController.createPixStructure
);

routerData.post(
  '/ibge-structure',
  sessionMiddleware,
  adminOnly,
  validateData(z.object({ body: schemas.ibgeStructureArray })),
  dataController.createIBGEStructure
);

export default routerData;