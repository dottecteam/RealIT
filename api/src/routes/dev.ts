import { Router } from 'express';
import { resetDatabase, seedAdmin, getUsers, getSessions, getLogs } from '../controllers/devController';

const routerDev = Router();

// Operações de Escrita/Reset
routerDev.delete('/reset', resetDatabase);
routerDev.post('/seed-admin', seedAdmin);

// Operações de Leitura para Debug
routerDev.get('/users', getUsers);
routerDev.get('/sessions', getSessions);
routerDev.get('/logs', getLogs);

export default routerDev;