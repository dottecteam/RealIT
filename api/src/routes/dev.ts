import { Router } from 'express';
import { resetDatabase, seedAdmin, seedDev } from '../controllers/devController';
import { devOnly } from '../middlewares/roleMiddleware';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';

const routerDev = Router();

// Operações de Escrita/Reset
routerDev.delete('/reset-database', sessionMiddleware, devOnly, resetDatabase);
routerDev.post('/seed-admin', sessionMiddleware, devOnly ,seedAdmin);
routerDev.post('/seed-dev', sessionMiddleware, devOnly, seedDev);

export default routerDev;