import { Router } from 'express';
import { triggerSync } from '../controllers/syncController';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';

const routerSync = Router();

routerSync.post('/trigger', sessionMiddleware, adminOnly, triggerSync);

export default routerSync;
