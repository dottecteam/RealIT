import express from 'express'
import 'dotenv/config'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

// Rotas 
import routerUser from './routes/user'
import routerAuth from './routes/auth'
import routerData from './routes/data'
import routerDev from './routes/dev';

export const app = express()

app.use(helmet())

app.use(express.json())

const globalLimiter = rateLimit({
  windowMs: Number(process.env.GLOBAL_LIMIT_WINDOW_MS) || 20 * 60 * 1000,
  limit: Number(process.env.GLOBAL_LIMIT_MAX) || 100,
  message: { error: 'Muitas requisições vindas deste IP, tente novamente mais tarde.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
app.use(globalLimiter)

app.use('/users', routerUser)
app.use('/auth', routerAuth)
app.use('/data', routerData)
app.use('/dev', routerDev)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})