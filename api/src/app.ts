import express from 'express'
import 'dotenv/config'

//Rotas 
import routerUser from './routes/user'
import routerDados from './routes/data'

export const app = express()

app.use(express.json())
app.use('/user', routerUser)
app.use('/dados', routerDados)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})