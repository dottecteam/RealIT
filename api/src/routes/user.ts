import { Router } from 'express';
import {register, update , inactivate, activate, turnAdmin, turnUser, turnDev } from '../controllers/userWriteController';
import { listAll, getById, getByEmail, getByName, getProfile, getByRole, getUserSessions, getUserLogs, getSessions, getLogs } from '../controllers/userReadController';
import { sessionMiddleware } from '../middlewares/sessionMiddleware';
import { adminOnly, devOnly } from '../middlewares/roleMiddleware';
import { validateData } from '../middlewares/dataMiddleware';
import { createAccountLimiter } from '../middlewares/rateLimiter';
import { createUserSchema, updateUserSchema, searchUserSchema, getByEmailSchema, getByIdSchema, getByRoleSchema } from '../schemas/userSchemas';

const router = Router();

router.get('/me', sessionMiddleware, getProfile);
router.get('/', sessionMiddleware, adminOnly, listAll)
router.get('/search', sessionMiddleware, adminOnly, validateData(searchUserSchema), getByName);
router.get('/id/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), getById);
router.get('/email/:email', sessionMiddleware, adminOnly, validateData(getByEmailSchema), getByEmail);
router.get('/role/:role', sessionMiddleware, adminOnly, validateData(getByRoleSchema), getByRole);

router.get('/sessions', sessionMiddleware, devOnly, getSessions);
router.get('/sessions/:id', sessionMiddleware, devOnly, validateData(getByIdSchema), getUserSessions);
router.get('/logs', sessionMiddleware, devOnly, getLogs);
router.get('/logs/:id', sessionMiddleware, devOnly, validateData(getByIdSchema), getUserLogs);

router.post('/create', sessionMiddleware, adminOnly, createAccountLimiter, validateData(createUserSchema), register);
router.put('/edit/:id', sessionMiddleware, adminOnly, validateData(updateUserSchema), update);
router.patch('/inactivate/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), inactivate);
router.patch('/activate/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), activate);
router.patch('/role/admin/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), turnAdmin);
router.patch('/role/user/:id', sessionMiddleware, adminOnly, validateData(getByIdSchema), turnUser);
router.patch('/role/dev/:id', sessionMiddleware, devOnly, validateData(getByIdSchema), turnDev);

export default router;