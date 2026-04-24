import { rateLimit } from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 5, // Apenas 5 tentativas de login por IP
  message: { 
    error: 'Bloqueio por suspeita de força bruta. Tente novamente em uma hora.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const createAccountLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 dia
  limit: 10, // Permite criar apenas 10 contas por IP por dia
  message: { error: 'Limite de criação de contas atingido para hoje.' }
})