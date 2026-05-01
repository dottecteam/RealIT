import { rateLimit } from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_LIMIT_WINDOW_MS) || 20 * 60 * 1000,
  limit: Number(process.env.AUTH_LIMIT_MAX) || 5,
  message: { 
     error: 'Bloqueio por suspeita de força bruta. Tente novamente em instantes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const createAccountLimiter = rateLimit({
  windowMs: Number(process.env.CREATE_ACCOUNT_LIMIT_WINDOW_MS) || 24 * 60 * 60 * 1000,
  limit: Number(process.env.CREATE_ACCOUNT_LIMIT_MAX) || 10,
  message: { error: 'Limite de criação de contas atingido para hoje.' }
})