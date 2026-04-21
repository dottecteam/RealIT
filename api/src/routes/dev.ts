import { Router } from 'express';
import { resetDatabase, seedAdmin } from '../controllers/devController';

const routerDev = Router();

routerDev.delete('/reset', resetDatabase);
routerDev.post('/seed-admin', seedAdmin);

export default routerDev;