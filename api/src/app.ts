import express from 'express'
import 'dotenv/config'

//Rotas 
import routerUser from './routes/user'
import routerAuth from './routes/auth'
import routerDados from './routes/data'

// Rotas de desenvolvimento (limpar banco, criar admin, etc)
import routerDev from './routes/dev';

export const app = express()

app.use(express.json())
app.use('/user', routerUser)
app.use('/auth', routerAuth)
app.use('/dados', routerDados)

// Lembrete: Excluir essas rotas de desenvolvimento antes de ir para produção
app.use('/dev', routerDev)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})