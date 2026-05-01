import { Router } from 'express';
import { resetDatabase, seedAdmin, seedDev } from '../controllers/devController';
import { devOnly } from '../middlewares/roleMiddleware';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';

const routerDev = Router();

// Operações de Escrita/Reset
routerDev.delete('/reset-database', resetDatabase);
routerDev.post('/seed-admin' ,seedAdmin);
routerDev.post('/seed-dev', seedDev);

export default routerDev;